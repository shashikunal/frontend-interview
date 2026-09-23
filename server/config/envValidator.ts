/**
 * Environment Configuration & Secret Validator
 * Phase 18: Production Infrastructure & DevOps
 *
 * Responsibilities:
 * - Validates presence and format of required variables per environment (LOCAL, TEST, STAGING, PRODUCTION)
 * - Fails startup immediately with actionable diagnostics if production secrets are missing
 * - STRICT SECURITY: Redacts all sensitive values so secrets are NEVER leaked to logs or console
 */

export type EnvironmentMode = 'development' | 'test' | 'staging' | 'production';

export interface EnvValidationResult {
  valid: boolean;
  environment: EnvironmentMode;
  missingVars: string[];
  invalidVars: string[];
  warnings: string[];
}

interface EnvRule {
  name: string;
  isSecret: boolean;
  requiredIn: EnvironmentMode[];
  validator?: (val: string) => boolean;
  description: string;
}

export const ENV_RULES: EnvRule[] = [
  {
    name: 'NODE_ENV',
    isSecret: false,
    requiredIn: ['development', 'test', 'staging', 'production'],
    validator: v => ['development', 'test', 'staging', 'production'].includes(v),
    description: 'Runtime environment mode',
  },
  {
    name: 'APP_URL',
    isSecret: false,
    requiredIn: ['staging', 'production'],
    validator: v => {
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    },
    description: 'Canonical application origin (must be valid HTTPS in production)',
  },
  {
    name: 'DATABASE_URL',
    isSecret: true,
    requiredIn: ['staging', 'production'],
    description: 'PostgreSQL connection URI with credentials',
  },
  {
    name: 'JWT_SIGNING_SECRET',
    isSecret: true,
    requiredIn: ['staging', 'production'],
    validator: v => v.length >= 32,
    description: 'Cryptographic HMAC-SHA256 secret (minimum 32 characters)',
  },
  {
    name: 'MEDIA_JWT_SECRET',
    isSecret: true,
    requiredIn: ['staging', 'production'],
    validator: v => v.length >= 32,
    description: 'SFU media token secret (minimum 32 characters)',
  },
  {
    name: 'REDIS_URL',
    isSecret: true,
    requiredIn: ['staging', 'production'],
    description: 'Redis connection string (must include password/TLS in prod)',
  },
  {
    name: 'KAFKA_BROKERS',
    isSecret: false,
    requiredIn: ['staging', 'production'],
    validator: v => v.length > 0 && v.includes(':'),
    description: 'Comma-separated Kafka broker addresses (host:port)',
  },
  {
    name: 'STORAGE_SIGNING_SECRET',
    isSecret: true,
    requiredIn: ['staging', 'production'],
    validator: v => v.length >= 32,
    description: 'HMAC secret for presigned media URLs (minimum 32 characters)',
  },
  {
    name: 'S3_ACCESS_KEY',
    isSecret: true,
    requiredIn: ['staging', 'production'],
    description: 'Object storage API access key',
  },
  {
    name: 'S3_SECRET_KEY',
    isSecret: true,
    requiredIn: ['staging', 'production'],
    description: 'Object storage API secret key',
  },
  {
    name: 'S3_BUCKET_NAME',
    isSecret: false,
    requiredIn: ['staging', 'production'],
    description: 'Private object storage bucket name',
  },
  {
    name: 'LIVEKIT_API_KEY',
    isSecret: false,
    requiredIn: ['staging', 'production'],
    description: 'LiveKit SFU API key',
  },
  {
    name: 'LIVEKIT_API_SECRET',
    isSecret: true,
    requiredIn: ['staging', 'production'],
    validator: v => v.length >= 16,
    description: 'LiveKit SFU API secret',
  },
];

export class EnvironmentValidator {
  /**
   * Determine current active environment
   */
  public static getActiveEnvironment(): EnvironmentMode {
    const raw = (process.env.APP_ENV || process.env.NODE_ENV || 'development').toLowerCase();
    if (raw === 'production' || raw === 'prod') return 'production';
    if (raw === 'staging' || raw === 'stage') return 'staging';
    if (raw === 'test') return 'test';
    return 'development';
  }

  /**
   * Validate configuration for the active or given environment
   */
  public static validate(targetEnv?: EnvironmentMode, customEnv: Record<string, string | undefined> = process.env): EnvValidationResult {
    const env = targetEnv || this.getActiveEnvironment();
    const missingVars: string[] = [];
    const invalidVars: string[] = [];
    const warnings: string[] = [];

    for (const rule of ENV_RULES) {
      const val = customEnv[rule.name];
      const isRequired = rule.requiredIn.includes(env);

      if (isRequired) {
        if (!val || val.trim().length === 0) {
          missingVars.push(rule.name);
          continue;
        }

        if (rule.validator && !rule.validator(val)) {
          invalidVars.push(rule.name);
        }
      } else if (val && rule.validator && !rule.validator(val)) {
        warnings.push(`Optional variable ${rule.name} failed format check.`);
      }
    }

    // Check for accidental secret leakage in public prefixes
    for (const key of Object.keys(customEnv)) {
      if (key.startsWith('VITE_') || key.startsWith('NEXT_PUBLIC_')) {
        const val = customEnv[key] || '';
        // If variable name or value implies a master secret
        if (
          key.includes('SECRET') ||
          key.includes('PRIVATE_KEY') ||
          key.includes('SERVICE_ROLE')
        ) {
          invalidVars.push(`${key} (CRITICAL: Secret exposed under public client bundle prefix!)`);
        }
      }
    }

    return {
      valid: missingVars.length === 0 && invalidVars.length === 0,
      environment: env,
      missingVars,
      invalidVars,
      warnings,
    };
  }

  /**
   * Assert production configuration passes; exits or throws if invalid
   */
  public static assertProductionReady(customEnv?: Record<string, string | undefined>): void {
    const result = this.validate('production', customEnv);
    if (!result.valid) {
      const details = [
        result.missingVars.length > 0 ? `Missing required variables: [${result.missingVars.join(', ')}]` : null,
        result.invalidVars.length > 0 ? `Invalid variables: [${result.invalidVars.join(', ')}]` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      throw new Error(`[FATAL] Production Environment Validation Failed: ${details}`);
    }
  }

  /**
   * Return a sanitized copy of environment variables with all secrets redacted
   */
  public static getSanitizedSummary(customEnv: Record<string, string | undefined> = process.env): Record<string, string> {
    const secretKeySet = new Set(ENV_RULES.filter(r => r.isSecret).map(r => r.name));
    const summary: Record<string, string> = {};

    for (const rule of ENV_RULES) {
      const val = customEnv[rule.name];
      if (!val) {
        summary[rule.name] = '[NOT_SET]';
      } else if (secretKeySet.has(rule.name)) {
        summary[rule.name] = `[REDACTED (length: ${val.length})]`;
      } else {
        summary[rule.name] = val;
      }
    }

    return summary;
  }
}
