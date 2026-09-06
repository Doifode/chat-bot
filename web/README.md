# chat-bot web

Minimal Next.js (App Router) UI for the FastAPI backend in `../api`.
Uses Tailwind + shadcn-style components. The browser only talks to Next.js;
`app/api/*` route handlers proxy every call to the real API.

## Run

```bash
cd web
cp .env.local.example .env.local   # set API_BASE_URL if not localhost:8000
npm install
npm run dev                        # http://localhost:3000
```

The FastAPI server must be running separately:

```bash
cd ../api
uvicorn app.main:app --reload      # http://localhost:8000
```

## Proxy routes -> backend

| UI call | Backend |
|---|---|
| `POST /api/users` | `POST /users/` |
| `GET /api/users/:id` | `GET /users/:id` |
| `GET /api/users/:id/chats` | `GET /users/:id/chats` |
| `POST /api/users/:id/metadata` | `POST /users/:id/metadata` |
| `POST /api/chats` | `POST /chats/` |
| `GET /api/chats/:id/messages` | `GET /chats/:id/messages` |
| `POST /api/chats/:id/messages` | `POST /chats/:id/messages` |
