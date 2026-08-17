# AI Email Generator — Backend

Express server exposing `/api/generate` for the frontend.

## Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:5000` by default (or `PORT` env var).

## Endpoints

- `GET /health` — health check
- `POST /api/generate` — body: `{ emailType, recipient, tone, length, additionalDetails }`
