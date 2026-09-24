/**
 * Meeting Reminder Server-Side Scheduler
 * Generates automated server-side reminders (24h, 1h, 30m, 5m) before meeting start_at.
 * Runs completely independent of browser state.
 * Emits Kafka meeting.reminder.scheduled and meeting.reminder.triggered events.
 */

import type { MeetingRecord, NotificationType } from '../meetings/meetingOpsTypes.ts';
import { notificationWorker } from '../notifications/notificationWorker.ts';
import { createMeetingOpsEvent } from '../kafka/eventContracts.ts';
import { outboxService } from '../kafka/outboxService.ts';

interface ReminderIntervalConfig {
  type: NotificationType;
  offsetMs: number; // Milliseconds before start_at
}

const REMINDER_INTERVALS: ReminderIntervalConfig[] = [
  { type: 'REMINDER_24H', offsetMs: 24 * 60 * 60 * 1000 },
  { type: 'REMINDER_1H', offsetMs: 60 * 60 * 1000 },
  { type: 'REMINDER_30M', offsetMs: 30 * 60 * 1000 },
  { type: 'REMINDER_5M', offsetMs: 5 * 60 * 1000 },
];

export class MeetingScheduler {
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Schedule all configured reminders for a meeting and its participants
   */
  public scheduleMeetingReminders(
    meeting: MeetingRecord,
    studentIds: string[],
    preferences?: {
      reminder_24h?: boolean;
      reminder_1h?: boolean;
      reminder_30m?: boolean;
      reminder_5m?: boolean;
    }
  ): void {
    if (meeting.status === 'CANCELLED' || meeting.status === 'COMPLETED') {
      return;
    }

    const startTime = new Date(meeting.start_at).getTime();
    const now = Date.now();

    for (const config of REMINDER_INTERVALS) {
      // Check user/meeting preferences
      if (config.type === 'REMINDER_24H' && preferences?.reminder_24h === false) continue;
      if (config.type === 'REMINDER_1H' && preferences?.reminder_1h === false) continue;
      if (config.type === 'REMINDER_30M' && preferences?.reminder_30m === false) continue;
      if (config.type === 'REMINDER_5M' && preferences?.reminder_5m === false) continue;

      const triggerTime = startTime - config.offsetMs;
      const scheduledIso = new Date(triggerTime).toISOString();

      for (const studentId of studentIds) {
        const dedupeKey = `${meeting.id}:${studentId}:${config.type}`;

        // 1. Persist scheduled reminder record in worker/database
        notificationWorker.scheduleNotification({
          meetingId: meeting.id,
          userId: studentId,
          notificationType: config.type,
          scheduledAt: scheduledIso,
        });

        // 2. Publish meeting.reminder.scheduled domain event to Kafka outbox
        const scheduledEvent = createMeetingOpsEvent(
          'meeting.reminder.scheduled',
          meeting.id,
          studentId,
          {
            meetingId: meeting.id,
            studentId,
            reminderType: config.type,
            scheduledAt: scheduledIso,
          }
        );
        outboxService.recordEvent(
          'meeting.reminder.scheduled',
          'MEETING',
          meeting.id,
          scheduledEvent.payload,
          { correlationId: scheduledEvent.correlationId }
        );

        // 3. If trigger time is in the future, register timer or let cron dispatch
        const msUntilTrigger = triggerTime - now;
        if (msUntilTrigger > 0 && msUntilTrigger < 24 * 60 * 60 * 1000) {
          // Clear any existing timer for this key
          const existing = this.activeTimers.get(dedupeKey);
          if (existing) clearTimeout(existing);

          const timer = setTimeout(async () => {
            await this.triggerReminder(meeting, studentId, config.type);
            this.activeTimers.delete(dedupeKey);
          }, msUntilTrigger);

          this.activeTimers.set(dedupeKey, timer);
        }
      }
    }
  }

  /**
   * Fires the reminder and publishes meeting.reminder.triggered event
   */
  public async triggerReminder(
    meeting: MeetingRecord,
    studentId: string,
    reminderType: NotificationType
  ): Promise<void> {
    // 1. Emit Kafka meeting.reminder.triggered event
    const triggerEvent = createMeetingOpsEvent(
      'meeting.reminder.triggered',
      meeting.id,
      studentId,
      {
        meeting,
        studentId,
        reminderType,
      }
    );

    outboxService.recordEvent(
      'meeting.reminder.triggered',
      'MEETING',
      meeting.id,
      triggerEvent.payload,
      { correlationId: triggerEvent.correlationId }
    );

    // 2. Hand off to worker for idempotent delivery
    await notificationWorker.handleKafkaEvent(triggerEvent);
  }

  /**
   * Cancel all scheduled reminders for a meeting (e.g. when cancelled)
   */
  public cancelMeetingReminders(meetingId: string): void {
    for (const [key, timer] of this.activeTimers.entries()) {
      if (key.startsWith(`${meetingId}:`)) {
        clearTimeout(timer);
        this.activeTimers.delete(key);
      }
    }
  }
}

export const meetingScheduler = new MeetingScheduler();
