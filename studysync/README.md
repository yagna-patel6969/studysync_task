# StudySync

StudySync is a full-stack study planning app with a React/Vite frontend and an Express/MongoDB backend.

## Structure

- `frontend/`: React app built with Vite
- `backend/`: Express API, MongoDB models, auth, groups, notifications, calendar sync

## Local Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

## Required Backend Environment Variables

See [`backend/.env.example`](/C:/Users/Yagna/OneDrive/Desktop/task/studysync/backend/.env.example).

Minimum required for deployment:

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `APP_URL`

Optional integrations:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`

## Frontend Environment Variables

See [`frontend/.env.example`](/C:/Users/Yagna/OneDrive/Desktop/task/studysync/frontend/.env.example).

- `VITE_API_URL`

## Deployment Checklist

1. Set `VITE_API_URL` to your deployed backend API, for example `https://api.example.com/api`.
2. Set `APP_URL` to your deployed frontend URL, for example `https://app.example.com`.
3. Set `CORS_ORIGINS` to the allowed frontend origins, comma-separated.
4. Set `GOOGLE_REDIRECT_URI` to `https://your-backend-domain/api/calendar/callback` if Google Calendar is enabled.
5. Provide a strong `JWT_SECRET`; the backend now exits on startup if it is missing.
6. Do not commit `.env`, `node_modules`, build output, or local temp files.

## Start Commands

- Frontend build: `npm run build`
- Backend start: `npm start`
