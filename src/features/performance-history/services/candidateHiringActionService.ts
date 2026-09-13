import { getAuthenticatedHistoryClient } from './historyReaderClient';

export interface CandidateAssignment {
  id: string;
  candidateId: string;
  title: string;
  track: 'MACHINE_CODING' | 'DSA' | 'CORE_PROGRAMMING' | 'FRONTEND_JS';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionsCount: number;
  deadline: string; // ISO string
  instructions?: string;
  status: 'Assigned' | 'In Progress' | 'Submitted' | 'Reviewed';
  assignedBy: string;
  assignedAt: string;
}

export interface ScheduledInterviewRound {
  id: string;
  candidateId: string;
  roundTitle: string;
  roundType: 'Technical Coding' | 'DSA & Algorithms' | 'System Design & Architecture' | 'Cultural & Behavioral';
  scheduledDate: string; // ISO string
  durationMinutes: number;
  meetingLink: string;
  interviewerNotes?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  interviewerName: string;
  createdAt: string;
}

const LOCAL_ASSIGNMENTS_KEY = 'candidate_assignments_v1';
const LOCAL_INTERVIEWS_KEY = 'candidate_interviews_v1';

class CandidateHiringActionService {
  /**
   * Get all assignments for a candidate
   */
  async getAssignments(candidateId: string): Promise<CandidateAssignment[]> {
    if (!candidateId) return [];

    // 1. Try Supabase
    try {
      const db = await getAuthenticatedHistoryClient();
      const { data, error } = await db
        .from('candidate_assignments')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('assigned_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          candidateId: d.candidate_id,
          title: d.title,
          track: d.track,
          difficulty: d.difficulty,
          questionsCount: d.questions_count,
          deadline: d.deadline,
          instructions: d.instructions,
          status: d.status,
          assignedBy: d.assigned_by,
          assignedAt: d.assigned_at,
        }));
      }
    } catch (_) {}

    // 2. Fallback to localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
        if (raw) {
          const all: CandidateAssignment[] = JSON.parse(raw);
          return all.filter(a => a.candidateId === candidateId);
        }
      }
    } catch (_) {}

    return [];
  }

  /**
   * Create or update a candidate assignment
   */
  async saveAssignment(
    input: Omit<CandidateAssignment, 'id' | 'assignedAt'> & { id?: string }
  ): Promise<CandidateAssignment> {
    const id = input.id || `assign-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const assignedAt = new Date().toISOString();

    const record: CandidateAssignment = {
      ...input,
      id,
      assignedAt,
    };

    // 1. Try Supabase
    try {
      const db = await getAuthenticatedHistoryClient();
      await db.from('candidate_assignments').upsert({
        id: record.id,
        candidate_id: record.candidateId,
        title: record.title,
        track: record.track,
        difficulty: record.difficulty,
        questions_count: record.questionsCount,
        deadline: record.deadline,
        instructions: record.instructions,
        status: record.status,
        assigned_by: record.assignedBy,
        assigned_at: record.assignedAt,
      });
    } catch (_) {}

    // 2. Persist in localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
        const all: CandidateAssignment[] = raw ? JSON.parse(raw) : [];
        const existingIdx = all.findIndex(a => a.id === record.id);
        if (existingIdx >= 0) {
          all[existingIdx] = record;
        } else {
          all.unshift(record);
        }
        localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(all));
      }
    } catch (_) {}

    return record;
  }

  /**
   * Update assignment status
   */
  async updateAssignmentStatus(
    assignmentId: string,
    status: 'Assigned' | 'In Progress' | 'Submitted' | 'Reviewed'
  ): Promise<void> {
    try {
      const db = await getAuthenticatedHistoryClient();
      await db.from('candidate_assignments').update({ status }).eq('id', assignmentId);
    } catch (_) {}

    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
        if (raw) {
          const all: CandidateAssignment[] = JSON.parse(raw);
          const item = all.find(a => a.id === assignmentId);
          if (item) {
            item.status = status;
            localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(all));
          }
        }
      }
    } catch (_) {}
  }

  /**
   * Get all scheduled interviews for a candidate
   */
  async getScheduledInterviews(candidateId: string): Promise<ScheduledInterviewRound[]> {
    if (!candidateId) return [];

    // 1. Try Supabase
    try {
      const db = await getAuthenticatedHistoryClient();
      const { data, error } = await db
        .from('candidate_scheduled_interviews')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('scheduled_date', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          candidateId: d.candidate_id,
          roundTitle: d.round_title,
          roundType: d.round_type,
          scheduledDate: d.scheduled_date,
          durationMinutes: d.duration_minutes,
          meetingLink: d.meeting_link,
          interviewerNotes: d.interviewer_notes,
          status: d.status,
          interviewerName: d.interviewer_name,
          createdAt: d.created_at,
        }));
      }
    } catch (_) {}

    // 2. Fallback to localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_INTERVIEWS_KEY);
        if (raw) {
          const all: ScheduledInterviewRound[] = JSON.parse(raw);
          return all.filter(i => i.candidateId === candidateId);
        }
      }
    } catch (_) {}

    return [];
  }

  /**
   * Schedule a new interview round
   */
  async scheduleInterview(
    input: Omit<ScheduledInterviewRound, 'id' | 'createdAt'> & { id?: string }
  ): Promise<ScheduledInterviewRound> {
    const id = input.id || `round-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const createdAt = new Date().toISOString();

    const record: ScheduledInterviewRound = {
      ...input,
      id,
      createdAt,
    };

    // 1. Try Supabase
    try {
      const db = await getAuthenticatedHistoryClient();
      await db.from('candidate_scheduled_interviews').upsert({
        id: record.id,
        candidate_id: record.candidateId,
        round_title: record.roundTitle,
        round_type: record.roundType,
        scheduled_date: record.scheduledDate,
        duration_minutes: record.durationMinutes,
        meeting_link: record.meetingLink,
        interviewer_notes: record.interviewerNotes,
        status: record.status,
        interviewer_name: record.interviewerName,
        created_at: record.createdAt,
      });
    } catch (_) {}

    // 2. Persist in localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_INTERVIEWS_KEY);
        const all: ScheduledInterviewRound[] = raw ? JSON.parse(raw) : [];
        const existingIdx = all.findIndex(i => i.id === record.id);
        if (existingIdx >= 0) {
          all[existingIdx] = record;
        } else {
          all.push(record);
        }
        localStorage.setItem(LOCAL_INTERVIEWS_KEY, JSON.stringify(all));
      }
    } catch (_) {}

    return record;
  }

  /**
   * Update scheduled interview status
   */
  async updateInterviewStatus(
    interviewId: string,
    status: 'Scheduled' | 'Completed' | 'Cancelled'
  ): Promise<void> {
    try {
      const db = await getAuthenticatedHistoryClient();
      await db.from('candidate_scheduled_interviews').update({ status }).eq('id', interviewId);
    } catch (_) {}

    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_INTERVIEWS_KEY);
        if (raw) {
          const all: ScheduledInterviewRound[] = JSON.parse(raw);
          const item = all.find(i => i.id === interviewId);
          if (item) {
            item.status = status;
            localStorage.setItem(LOCAL_INTERVIEWS_KEY, JSON.stringify(all));
          }
        }
      }
    } catch (_) {}
  }
}

export const candidateHiringActionService = new CandidateHiringActionService();
