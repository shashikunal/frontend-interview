/**
 * Server-Side RBAC & Authentication Middleware
 * Phase 1: Authentication & Token Security
 * Strictly enforces backend security: Client role / claims are NEVER trusted without cryptographic verification.
 */

import { tokenService } from './tokenService.ts';
import type { AuthContextUser, StandardApiErrorResponse } from './tokenTypes.ts';
import type { UserRole } from '../../src/features/auth/types/auth.types.ts';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  candidate: 1,
  pro_member: 2,
  interviewer: 3,
  admin: 4,
};

export function createErrorResponse(
  error: string,
  message: string,
  code: string,
  correlationId?: string
): StandardApiErrorResponse {
  return {
    success: false,
    error,
    message,
    code,
    timestamp: new Date().toISOString(),
    correlationId: correlationId || (typeof crypto !== 'undefined' ? crypto.randomUUID?.() : undefined),
  };
}

/**
 * Authentication Middleware: Extracts, parses, and cryptographically verifies Bearer token.
 */
export async function requireAuthMiddleware(req: any, res: any, next: any): Promise<void> {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;

  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(
      createErrorResponse(
        'Unauthorized',
        'Authentication required. Please provide a valid Bearer token.',
        'MISSING_TOKEN'
      )
    );
    return;
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // 1. Verify token
  const verification = tokenService.verifyMeetingToken(token);

  if (!verification.valid || !verification.claims) {
    const statusCode = verification.errorCode === 'EXPIRED' ? 401 : 401;
    res.status(statusCode).json(
      createErrorResponse(
        'Unauthorized',
        verification.error || 'Token verification failed.',
        verification.errorCode || 'INVALID_TOKEN'
      )
    );
    return;
  }

  // 2. Attach server-verified user into request context
  const claims = verification.claims;
  const authUser: AuthContextUser = {
    id: claims.userId,
    email: claims.userEmail,
    name: claims.userName,
    role: claims.userRole,
    permissions: claims.permissions || [],
    meetingRole: claims.meetingRole,
    meetingId: claims.meetingId,
    tokenId: claims.jti,
  };

  req.user = authUser;
  next();
}

/**
 * RBAC Role Guard Middleware: Enforces minimum required role or specific permitted roles.
 */
export function requireRoleMiddleware(allowedRoles: UserRole[]) {
  return (req: any, res: any, next: any): void => {
    const user: AuthContextUser = req.user;

    if (!user) {
      res.status(401).json(
        createErrorResponse('Unauthorized', 'Authentication context missing.', 'UNAUTHENTICATED')
      );
      return;
    }

    // Platform Super Admin always passes RBAC
    if (user.role === 'admin') {
      return next();
    }

    // Check if user role is explicitly allowed
    if (allowedRoles.includes(user.role)) {
      return next();
    }

    // Check hierarchical level
    const userLevel = ROLE_HIERARCHY[user.role] ?? 0;
    const minRequiredLevel = Math.min(...allowedRoles.map(r => ROLE_HIERARCHY[r] ?? 99));

    if (userLevel >= minRequiredLevel) {
      return next();
    }

    // Access Denied: 403 Forbidden
    res.status(403).json(
      createErrorResponse(
        'Forbidden',
        `Access denied. Required role: [${allowedRoles.join(', ')}], but current role is '${user.role}'.`,
        'FORBIDDEN'
      )
    );
  };
}

/**
 * RBAC Permission Guard Middleware: Checks for explicit permission capability string.
 */
export function requirePermissionMiddleware(permission: string) {
  return (req: any, res: any, next: any): void => {
    const user: AuthContextUser = req.user;

    if (!user) {
      res.status(401).json(
        createErrorResponse('Unauthorized', 'Authentication context missing.', 'UNAUTHENTICATED')
      );
      return;
    }

    // Admin wildcard access
    if (user.role === 'admin' || user.permissions.includes('admin:all') || user.permissions.includes('*')) {
      return next();
    }

    if (user.permissions.includes(permission)) {
      return next();
    }

    res.status(403).json(
      createErrorResponse(
        'Forbidden',
        `Access denied. Missing required permission '${permission}'.`,
        'INSUFFICIENT_PERMISSIONS'
      )
    );
  };
}
