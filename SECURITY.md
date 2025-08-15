# Security Policy

- Report vulnerabilities privately to the project maintainer.
- Do not open public issues for untriaged security findings.
- No production deployments exist; prioritize local environment hardening:
  - Keep `.env.local` private; never commit secrets.
  - Use `OFFLINE=true` for local development to avoid unintended outbound calls.
  - Rotate any leaked credentials immediately.
- Dependencies:
  - Run `npm audit` locally before releases; evaluate and remediate high/critical issues.
  - Pin direct dependencies where feasible; prefer minor/patch updates regularly.
- Runtime posture:
  - Deny-by-default outbound networking (planned); currently OFFLINE flag is honored.
  - Follow least-privilege for service tokens when introduced.
