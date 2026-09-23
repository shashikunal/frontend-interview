# Continuous Integration & Delivery Pipeline (Phase 18)

## 1. Pipeline Overview
The CI/CD pipeline enforces non-negotiable quality and security gates on every Pull Request and branch merge to `main`, `master`, and `staging`.

```
    [ Pull Request / Commit ]
                │
                ▼
      ┌──────────────────┐
      │ 1. npm ci        │  Deterministic dependency install
      └────────┬─────────┘
                │
                ▼
      ┌──────────────────┐
      │ 2. oxlint        │  Static code analysis & hook safety
      └────────┬─────────┘
                │
                ▼
      ┌──────────────────┐
      │ 3. tsc -b        │  Strict multi-project TypeScript typechecking
      └────────┬─────────┘
                │
                ▼
      ┌──────────────────┐
      │ 4. Test Suites   │  Infrastructure & subsystem regression tests
      └────────┬─────────┘
                │
                ▼
      ┌──────────────────┐
      │ 5. npm audit     │  Critical dependency vulnerability scan
      └────────┬─────────┘
                │
                ▼
      ┌──────────────────┐
      │ 6. SBOM Gen      │  CycloneDX supply-chain inventory
      └────────┬─────────┘
                │
                ▼
      ┌──────────────────┐
      │ 7. vite build    │  Production asset compilation & minification
      └────────┬─────────┘
                │
                ▼
      [ Quality Gates Passed ]
```

---

## 2. Quality Gates & Failure Criteria
A build fails immediately if:
1. `oxlint` detects any errors.
2. `tsc -b` detects any type errors or unused locals/parameters.
3. Any unit, integration, or regression test fails.
4. `npm audit` reports any critical-severity CVE.
5. `vite build` fails to produce valid bundles in `dist/`.
