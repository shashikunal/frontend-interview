/**
 * Lightweight Configuration-Driven Feature Flags
 * Phase 18: DevOps & Safe Rollouts
 *
 * Provides typed, zero-overhead boolean flag evaluations backed by process.env
 * with graceful defaults and runtime override support.
 */

export interface FeatureFlagDefinitions {
  ENABLE_RECORDING: boolean;
  ENABLE_TRANSCRIPTION: boolean;
  ENABLE_ADVANCED_COLLABORATION: boolean;
  ENABLE_KAFKA_OUTBOX: boolean;
  ENABLE_REDIS_RATE_LIMITER: boolean;
  ENABLE_DEEP_HEALTH_CHECKS: boolean;
  ENABLE_AUDIT_LOGGING: boolean;
}

const DEFAULT_FLAGS: FeatureFlagDefinitions = {
  ENABLE_RECORDING: true,
  ENABLE_TRANSCRIPTION: true,
  ENABLE_ADVANCED_COLLABORATION: true,
  ENABLE_KAFKA_OUTBOX: true,
  ENABLE_REDIS_RATE_LIMITER: true,
  ENABLE_DEEP_HEALTH_CHECKS: true,
  ENABLE_AUDIT_LOGGING: true,
};

export class FeatureFlags {
  private static overrides: Partial<FeatureFlagDefinitions> = {};

  /**
   * Check if a feature is enabled
   */
  public static isEnabled(flagName: keyof FeatureFlagDefinitions): boolean {
    if (this.overrides[flagName] !== undefined) {
      return Boolean(this.overrides[flagName]);
    }

    const envVal = process.env[flagName];
    if (envVal !== undefined) {
      return envVal.toLowerCase() === 'true' || envVal === '1';
    }

    return DEFAULT_FLAGS[flagName] ?? false;
  }

  /**
   * Set dynamic override for testing or emergency circuit breaking
   */
  public static setOverride(flagName: keyof FeatureFlagDefinitions, value: boolean): void {
    this.overrides[flagName] = value;
  }

  /**
   * Clear all overrides
   */
  public static resetOverrides(): void {
    this.overrides = {};
  }

  /**
   * Get snapshot of all active feature flags
   */
  public static getAllFlags(): FeatureFlagDefinitions {
    const keys = Object.keys(DEFAULT_FLAGS) as (keyof FeatureFlagDefinitions)[];
    const snapshot = {} as FeatureFlagDefinitions;
    for (const k of keys) {
      snapshot[k] = this.isEnabled(k);
    }
    return snapshot;
  }
}
