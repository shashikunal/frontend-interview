/**
 * Calendar Service: RFC 5545 iCalendar (ICS) Generator & Web Calendar Link Providers
 * Supports Google Calendar, Outlook, Apple Calendar, and standard calendar clients.
 * Production-grade: strict UTC/timezone formatting, text escaping, and attendee handling.
 */

import type { MeetingRecord } from '../meetings/meetingOpsTypes.ts';

function formatDateToICS(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date format for ICS generation: ${isoString}`);
  }
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeICSValue(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function resolveAbsoluteUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = process.env.APP_BASE_URL || 'https://frontend-interview-chi.vercel.app';
  return `${baseUrl.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
}

export class CalendarService {
  /**
   * Generates standard RFC 5545 .ics text for a meeting event
   */
  public generateICS(
    meeting: MeetingRecord,
    options: {
      organizerName?: string;
      organizerEmail?: string;
      attendees?: Array<{ name?: string; email?: string }>;
    } = {}
  ): string {
    const fullMeetingUrl = resolveAbsoluteUrl(meeting.meeting_url);
    const uid = `meet-${meeting.id}@frontend-interview.com`;
    const dtStamp = formatDateToICS(new Date().toISOString());
    const dtStart = formatDateToICS(meeting.start_at);
    const dtEnd = formatDateToICS(meeting.end_at);

    const summary = escapeICSValue(meeting.title);
    const description = escapeICSValue(
      `${meeting.description || ''}\n\nJoin Meeting via ${meeting.meeting_provider}:\n${fullMeetingUrl}`
    );
    const location = escapeICSValue(`${meeting.meeting_provider} - ${fullMeetingUrl}`);
    const url = escapeICSValue(fullMeetingUrl);

    const organizerEmail = options.organizerEmail || 'no-reply@frontend-interview.com';
    const organizerName = escapeICSValue(options.organizerName || meeting.trainer_name || 'Interview Platform');

    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Frontend MasterDocs University//Meeting Ops 2.0//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `URL:${url}`,
      `STATUS:${meeting.status === 'CANCELLED' ? 'CANCELLED' : 'CONFIRMED'}`,
      `ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}`,
    ];

    if (options.attendees && options.attendees.length > 0) {
      for (const att of options.attendees) {
        if (att.email) {
          const cn = escapeICSValue(att.name || att.email);
          lines.push(`ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${cn}:mailto:${att.email}`);
        }
      }
    }

    // 15-minute standard reminder trigger
    lines.push(
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${summary}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    );

    return lines.join('\r\n');
  }

  /**
   * Generates a 1-click Google Calendar web event creation URL
   * Never requires frontend secrets. Directly links to Google Calendar UI.
   */
  public getGoogleCalendarUrl(meeting: MeetingRecord): string {
    const fullUrl = resolveAbsoluteUrl(meeting.meeting_url);
    const startIso = formatDateToICS(meeting.start_at);
    const endIso = formatDateToICS(meeting.end_at);

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: meeting.title,
      dates: `${startIso}/${endIso}`,
      details: `${meeting.description || ''}\n\nJoin ${meeting.meeting_provider}: ${fullUrl}`,
      location: fullUrl,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  /**
   * Generates a 1-click Outlook Web event creation URL
   */
  public getOutlookCalendarUrl(meeting: MeetingRecord): string {
    const fullUrl = resolveAbsoluteUrl(meeting.meeting_url);
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: meeting.title,
      startdt: meeting.start_at,
      enddt: meeting.end_at,
      body: `${meeting.description || ''}\n\nJoin ${meeting.meeting_provider}: ${fullUrl}`,
      location: fullUrl,
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }
}

export const calendarService = new CalendarService();
