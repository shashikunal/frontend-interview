import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Define canonical meeting creation Zod schema
const meetingCreateSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().optional(),
  meeting_type: z.enum(['Technical Discussion', 'System Design', 'Code Review', 'Interview']),
  meeting_provider: z.enum(['Google Meet', 'Zoom', 'Custom WebRTC']),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  timezone: z.string().min(1),
  capacity: z.number().int().min(1).max(500),
  student_ids: z.array(z.string()).optional(),
});

describe('Zod Validation Schemas Unit Tests', () => {
  it('should validate a valid meeting creation payload', () => {
    const validPayload = {
      title: 'Distributed Systems Masterclass',
      description: 'Deep dive into event driven architectures',
      meeting_type: 'System Design',
      meeting_provider: 'Google Meet',
      start_at: '2026-10-01T10:00:00.000Z',
      end_at: '2026-10-01T11:30:00.000Z',
      timezone: 'Asia/Kolkata',
      capacity: 50,
      student_ids: ['student-1', 'student-2'],
    };

    const parsed = meetingCreateSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  it('should reject invalid payload with short title and bad datetime format', () => {
    const invalidPayload = {
      title: 'A',
      meeting_type: 'InvalidType',
      meeting_provider: 'Google Meet',
      start_at: 'invalid-date',
      end_at: '2026-10-01T11:30:00.000Z',
      timezone: 'Asia/Kolkata',
      capacity: -5,
    };

    const parsed = meetingCreateSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      expect(fieldErrors.title).toBeDefined();
      expect(fieldErrors.meeting_type).toBeDefined();
      expect(fieldErrors.start_at).toBeDefined();
      expect(fieldErrors.capacity).toBeDefined();
    }
  });

  it('should reject missing required fields', () => {
    const emptyPayload = {};
    const parsed = meetingCreateSchema.safeParse(emptyPayload);
    expect(parsed.success).toBe(false);
  });
});
