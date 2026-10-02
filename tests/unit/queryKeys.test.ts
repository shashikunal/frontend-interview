import { describe, it, expect } from 'vitest';
import { queryKeys } from '../../src/lib/query/queryKeys';

describe('TanStack Query Keys Hierarchy Tests', () => {
  it('should generate deterministic query keys for meetings', () => {
    expect(queryKeys.meetings.all).toEqual(['meetings']);
    expect(queryKeys.meetings.list({ search: 'meta' })).toEqual(['meetings', 'list', { search: 'meta' }]);
    expect(queryKeys.meetings.detail('meet-101')).toEqual(['meetings', 'detail', 'meet-101']);
    expect(queryKeys.meetings.participants('meet-101')).toEqual(['meetings', 'participants', 'meet-101']);
  });

  it('should generate deterministic query keys for candidates', () => {
    expect(queryKeys.candidates.all).toEqual(['candidates']);
    expect(queryKeys.candidates.list({ batch: '2026' })).toEqual(['candidates', 'list', { batch: '2026' }]);
    expect(queryKeys.candidates.detail('cand-42')).toEqual(['candidates', 'detail', 'cand-42']);
    expect(queryKeys.candidates.performance('cand-42')).toEqual(['candidates', 'performance', 'cand-42']);
  });

  it('should generate deterministic query keys for questions and notifications', () => {
    expect(queryKeys.questions.all).toEqual(['questions']);
    expect(queryKeys.questions.bank('javascript')).toEqual(['questions', 'bank', 'javascript']);
    expect(queryKeys.notifications.all).toEqual(['notifications']);
    expect(queryKeys.notifications.user('usr-1')).toEqual(['notifications', 'user', 'usr-1']);
  });
});
