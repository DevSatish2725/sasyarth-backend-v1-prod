## ADR-001: Environment Validation

### Decision
Use Zod to validate environment variables during application startup.

### Why
- Prevent runtime configuration errors.
- Provide type-safe access to configuration.
- Fail fast if required variables are missing.

### Status
Accepted