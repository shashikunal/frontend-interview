import { supabase } from '../../../lib/supabase/client'
import type {
  UserRole,
  RoleDefinition,
  PermissionDefinition,
  FeatureEntitlements,
} from '../types/auth.types'
import { DEFAULT_ENTITLEMENTS } from '../types/auth.types'

export const rbacService = {
  /**
   * Fetch all roles from public.roles
   */
  getRoles: async (): Promise<RoleDefinition[]> => {
    try {
      const { data, error } = await supabase.from('roles').select('*').order('hierarchy_level', { ascending: true })
      if (error || !Array.isArray(data)) throw error
      return data.map(r => ({
        id: r.id as UserRole,
        name: r.name,
        description: r.description,
        hierarchyLevel: r.hierarchy_level,
      }))
    } catch {
      return [
        { id: 'guest', name: 'Guest', description: 'Unauthenticated visitor', hierarchyLevel: 0 },
        { id: 'candidate', name: 'Candidate', description: 'Standard candidate tier', hierarchyLevel: 1 },
        { id: 'pro_member', name: 'Pro Member', description: 'Full access to 22,222 questions & system design', hierarchyLevel: 2 },
        { id: 'interviewer', name: 'Interviewer', description: 'Interviewer & rubric reviewer tier', hierarchyLevel: 3 },
        { id: 'admin', name: 'Admin', description: 'Platform Administrator with complete control', hierarchyLevel: 4 },
      ]
    }
  },

  /**
   * Fetch all permissions from public.permissions
   */
  getPermissions: async (): Promise<PermissionDefinition[]> => {
    try {
      const { data, error } = await supabase.from('permissions').select('*').order('module', { ascending: true })
      if (error || !Array.isArray(data)) throw error
      return data.map(p => ({
        id: p.id,
        name: p.name,
        module: p.module,
        description: p.description,
      }))
    } catch {
      return [
        { id: 'questions:read_basic', name: 'Read Basic Questions', module: 'questions', description: 'Access preview questions' },
        { id: 'questions:read_full', name: 'Read Full Question Bank', module: 'questions', description: 'Access full 22,222 questions' },
        { id: 'coding:execute', name: 'Execute Code Sandbox', module: 'coding', description: 'Run Monaco sandbox' },
        { id: 'system_design:access', name: 'System Design Studio', module: 'system_design', description: 'Access 4-tier canvas' },
        { id: 'mocks:video_ai', name: 'AI Video Mock Interview', module: 'mocks', description: 'Access live video mock' },
        { id: 'studios:compilers', name: 'Compiler Visualizers', module: 'studios', description: 'Access AST explorer & SDUI' },
        { id: 'sync:cloud_database', name: 'Postgres Cloud Sync', module: 'database', description: 'Sync progress securely' },
        { id: 'admin:users_manage', name: 'Manage Users & Roles', module: 'admin', description: 'Manage users and RBAC' },
      ]
    }
  },

  /**
   * Admin: Assign role to user in public.profiles and public.user_roles
   */
  assignUserRole: async (userId: string, newRole: UserRole): Promise<{ success: boolean; message: string }> => {
    if (!userId) {
      return { success: false, message: 'User ID is required.' }
    }

    try {
      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          feature_entitlements: DEFAULT_ENTITLEMENTS[newRole],
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (profileError) throw profileError

      // 2. Upsert user_roles table
      await supabase.from('user_roles').upsert({
        user_id: userId,
        role_id: newRole,
      })

      return { success: true, message: `Role updated to ${newRole.toUpperCase()} successfully!` }
    } catch (err: unknown) {
      return { success: false, message: (err as Error).message || 'Failed to update user role.' }
    }
  },

  /**
   * Admin: 1-Click Update Feature Entitlements
   */
  updateEntitlements: async (
    userId: string,
    entitlements: FeatureEntitlements
  ): Promise<{ success: boolean; message: string }> => {
    if (!userId) {
      return { success: false, message: 'User ID is required.' }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          feature_entitlements: entitlements,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) throw error

      return { success: true, message: 'Feature entitlements updated successfully!' }
    } catch (err: unknown) {
      return { success: false, message: (err as Error).message || 'Failed to update entitlements.' }
    }
  },
}
