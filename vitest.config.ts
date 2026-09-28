import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: [
      'tests/unit/**/*.test.ts',
      'tests/integration/**/*.test.ts',
      'src/**/*.test.ts',
      'server/**/*.test.ts',
      'api/**/*.test.ts',
    ],
    exclude: ['tests/*.spec.ts', 'node_modules', 'dist'],
  },
});
