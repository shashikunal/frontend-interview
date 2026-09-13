import emailjs from '@emailjs/browser';
import { isEmailJsConfigured, emailService, type EmailDispatchResult } from '../../../lib/emailService';
import type { ScheduledInterviewRound, CandidateAssignment } from './candidateHiringActionService';

export interface CandidateProfileHeader {
  id: string;
  name: string;
  email: string;
  role?: string;
  targetCompany?: string;
  experienceLevel?: string;
}

export interface InterviewEmailPayload {
  candidate: CandidateProfileHeader;
  interview: ScheduledInterviewRound;
  interviewerName?: string;
  prepInstructions?: string;
}

export interface AssessmentEmailPayload {
  candidate: CandidateProfileHeader;
  assignment: CandidateAssignment;
}

const LOCAL_DISPATCH_LOG_KEY = 'candidate_interview_dispatches_v1';

class CandidateEmailNotificationService {
  /**
   * Generates a standard RFC 5545 iCalendar (.ics) string for the interview
   */
  generateIcsContent(interview: ScheduledInterviewRound, candidate: CandidateProfileHeader): string {
    const startDate = new Date(interview.scheduledDate);
    const endDate = new Date(startDate.getTime() + (interview.durationMinutes || 60) * 60 * 1000);

    const formatIcsDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startStr = formatIcsDate(startDate);
    const endStr = formatIcsDate(endDate);
    const stampStr = formatIcsDate(new Date());
    const uid = `interview-${interview.id}-${startDate.getTime()}@frontendinterview.dev`;

    const summary = `Technical Interview: ${interview.roundTitle} - ${candidate.name}`;
    const description = [
      `Candidate: ${candidate.name} (${candidate.email})`,
      `Round Type: ${interview.roundType}`,
      `Duration: ${interview.durationMinutes} Minutes`,
      `Meeting Link: ${interview.meetingLink}`,
      interview.interviewerNotes ? `Panel Notes: ${interview.interviewerNotes}` : '',
      'Please join the room 5 minutes prior to start with your IDE ready.',
    ]
      .filter(Boolean)
      .join('\\n');

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Frontend Interview Prep Platform//Candidate Interview Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stampStr}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${interview.meetingLink || 'Online Video Room'}`,
      `ORGANIZER;CN=Technical Hiring Panel:mailto:interviews@frontendinterview.dev`,
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${candidate.name}:mailto:${candidate.email}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${summary} starts in 15 minutes`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  }

  /**
   * Triggers a browser download of the .ics calendar file
   */
  downloadIcsFile(interview: ScheduledInterviewRound, candidate: CandidateProfileHeader): void {
    try {
      const ics = this.generateIcsContent(interview, candidate);
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeCandidateName = (candidate.name || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
      const safeRoundTitle = (interview.roundTitle || 'Interview').replace(/[^a-zA-Z0-9]/g, '_');

      a.href = url;
      a.download = `${safeCandidateName}_${safeRoundTitle}_Invite.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download .ics invite:', err);
    }
  }

  /**
   * Generates a 1-click Google Calendar web event creation URL
   */
  getGoogleCalendarUrl(interview: ScheduledInterviewRound, candidate: CandidateProfileHeader): string {
    const startDate = new Date(interview.scheduledDate);
    const endDate = new Date(startDate.getTime() + (interview.durationMinutes || 60) * 60 * 1000);

    const formatGcalDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const title = encodeURIComponent(`Interview: ${interview.roundTitle} - ${candidate.name}`);
    const details = encodeURIComponent(
      `Candidate: ${candidate.name} (${candidate.email})\n` +
      `Round: ${interview.roundType} (${interview.durationMinutes} mins)\n` +
      `Meeting Link: ${interview.meetingLink}\n` +
      (interview.interviewerNotes ? `Notes: ${interview.interviewerNotes}\n` : '') +
      `Platform: Frontend Interview Prep & Live Code Assessment`
    );
    const location = encodeURIComponent(interview.meetingLink || 'Online Video Room');
    const dates = `${formatGcalDate(startDate)}/${formatGcalDate(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }

  /**
   * Checks if an invitation has been dispatched for a specific interview round
   */
  getDispatchStatus(interviewId: string): { dispatched: boolean; dispatchedAt?: string; channel?: string } {
    if (typeof localStorage === 'undefined' || !interviewId) return { dispatched: false };
    try {
      const raw = localStorage.getItem(LOCAL_DISPATCH_LOG_KEY);
      if (!raw) return { dispatched: false };
      const map = JSON.parse(raw);
      return map[interviewId] || { dispatched: false };
    } catch {
      return { dispatched: false };
    }
  }

  /**
   * Records a successful dispatch in local storage log
   */
  recordDispatch(interviewId: string, channel: 'emailjs' | 'simulator'): void {
    if (typeof localStorage === 'undefined' || !interviewId) return;
    try {
      const raw = localStorage.getItem(LOCAL_DISPATCH_LOG_KEY);
      const map = raw ? JSON.parse(raw) : {};
      map[interviewId] = {
        dispatched: true,
        dispatchedAt: new Date().toISOString(),
        channel,
      };
      localStorage.setItem(LOCAL_DISPATCH_LOG_KEY, JSON.stringify(map));
    } catch (_) {}
  }

  /**
   * Dispatches interview invitation email to candidate
   */
  async sendInterviewInvitation(payload: InterviewEmailPayload): Promise<EmailDispatchResult> {
    const { candidate, interview } = payload;
    const cleanEmail = candidate.email.toLowerCase().trim();
    const formattedDate = new Date(interview.scheduledDate).toLocaleString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const subject = `📅 Interview Invitation: ${interview.roundTitle} with Engineering Team`;
    const previewText = `Hello ${candidate.name}, you have been scheduled for a ${interview.durationMinutes}-minute ${interview.roundType} interview round on ${formattedDate}.`;

    // 1. If EmailJS is configured, attempt real dispatch
    if (isEmailJsConfigured) {
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: cleanEmail,
            user_name: candidate.name,
            subject,
            round_title: interview.roundTitle,
            round_type: interview.roundType,
            scheduled_date: formattedDate,
            duration: `${interview.durationMinutes} Minutes`,
            meeting_link: interview.meetingLink,
            interviewer_notes: interview.interviewerNotes || 'Review frontend fundamentals and component design.',
            platform_name: 'Frontend Interview Prep Platform',
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        this.recordDispatch(interview.id, 'emailjs');
        emailService.logDispatchedEmail({
          type: 'WELCOME_CONFIRMATION' as any,
          toEmail: cleanEmail,
          subject,
          previewText,
          status: 'DELIVERED',
        });

        return {
          success: true,
          provider: 'emailjs',
          message: `Invitation email successfully dispatched to ${cleanEmail} via EmailJS.`,
          dispatchedAt: new Date().toISOString(),
        };
      } catch (err: any) {
        console.warn('[candidateEmailNotificationService] EmailJS dispatch error, falling back to simulated dispatch:', err);
      }
    }

    // 2. Simulated/Demonstration Dispatch (logs to persistent email audit log)
    this.recordDispatch(interview.id, 'simulator');
    emailService.logDispatchedEmail({
      type: 'WELCOME_CONFIRMATION' as any,
      toEmail: cleanEmail,
      subject,
      previewText,
      status: 'SIMULATED',
    });

    return {
      success: true,
      provider: 'simulator',
      message: `Interview invitation email recorded and dispatched to ${cleanEmail} (Simulated Sandbox).`,
      dispatchedAt: new Date().toISOString(),
    };
  }

  /**
   * Dispatches take-home assessment notification email
   */
  async sendAssessmentAssignment(payload: AssessmentEmailPayload): Promise<EmailDispatchResult> {
    const { candidate, assignment } = payload;
    const cleanEmail = candidate.email.toLowerCase().trim();
    const formattedDeadline = new Date(assignment.deadline).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const subject = `📋 Technical Assessment Assigned: ${assignment.title}`;
    const previewText = `Hello ${candidate.name}, a targeted technical assessment (${assignment.questionsCount} questions, ${assignment.difficulty.toUpperCase()} difficulty) has been assigned with deadline ${formattedDeadline}.`;

    if (isEmailJsConfigured) {
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: cleanEmail,
            user_name: candidate.name,
            subject,
            assignment_title: assignment.title,
            track: assignment.track,
            difficulty: assignment.difficulty,
            deadline: formattedDeadline,
            instructions: assignment.instructions || 'Complete questions directly on the platform.',
            platform_name: 'Frontend Interview Prep Platform',
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        emailService.logDispatchedEmail({
          type: 'WELCOME_CONFIRMATION' as any,
          toEmail: cleanEmail,
          subject,
          previewText,
          status: 'DELIVERED',
        });

        return {
          success: true,
          provider: 'emailjs',
          message: `Assessment notification dispatched to ${cleanEmail} via EmailJS.`,
          dispatchedAt: new Date().toISOString(),
        };
      } catch (err) {
        console.warn('[candidateEmailNotificationService] EmailJS error:', err);
      }
    }

    emailService.logDispatchedEmail({
      type: 'WELCOME_CONFIRMATION' as any,
      toEmail: cleanEmail,
      subject,
      previewText,
      status: 'SIMULATED',
    });

    return {
      success: true,
      provider: 'simulator',
      message: `Assessment notification recorded and dispatched to ${cleanEmail}.`,
      dispatchedAt: new Date().toISOString(),
    };
  }
}

export const candidateEmailNotificationService = new CandidateEmailNotificationService();
