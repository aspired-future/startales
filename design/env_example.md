# Environment Example (local dev)

Copy these variables into a `.env.local` file at the repo root. Do not commit `.env.local`.

```
OFFLINE=true
PORT=4000
VITE_PORT=5173
```

Notes:
- When `OFFLINE=true`, the server is expected to avoid outbound calls (deny-by-default enforcement is implemented in later tasks).
- The demo/e2e configurations do not require any provider keys.
