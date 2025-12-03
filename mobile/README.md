# SurgiTrack Mobile (Expo)

A React Native + Expo client that mirrors the web experience: auth (login/register), dashboard, task list/detail with timer and error logging, attempt submission, and leaderboard. The app targets the same FastAPI backend.

## Getting started

1. Install dependencies (Node 18+/npm or yarn):
   ```bash
   cd mobile
   cp .env.example .env
   npm install
   # or: yarn install
   ```
2. Point the app at your API host:
   * Easiest: set `EXPO_PUBLIC_API_BASE_URL=https://your-api-host` in `.env` or your shell.
   * Alternative: edit `app.json` → `expo.extra.apiBase`.
3. Run the dev server:
   ```bash
   npm start
   ```
   Use the Expo Go app (physical device) or an Android/iOS emulator to load the QR/URL.

## Features

* **Auth** — Login/Register flows persist JWT using SecureStore/AsyncStorage.
* **Dashboard** — Displays proficiency progress and best scores per task.
* **Tasks** — Browse tasks, drill into details, start/stop a timer, pick a standard, select error checkboxes, and submit an attempt.
* **Leaderboard** — Global ranking from `/leaderboard/global`.
* **Profile** — View account details and sign out.

## Preparing for Google Play

1. Install the EAS CLI and log in:
   ```bash
   npm install -g eas-cli
   eas login
   ```
2. Configure builds (once):
   ```bash
   eas build:configure
   ```
3. Build a production Android artifact (uses `app.json` + `EXPO_PUBLIC_API_BASE_URL`):
   ```bash
   EXPO_PUBLIC_API_BASE_URL=https://your-api-host eas build -p android --profile production
   ```
4. Upload the generated `.aab` to the Google Play Console, complete policy forms, and publish.
5. **Branding assets:** add your own app icon and splash artwork under `mobile/assets/` (ignored by Git) and wire them into `app.json` before shipping to Play.

## Notes

* The timer uses device time to generate `started_at`/`ended_at` timestamps for the FastAPI scoring endpoint.
* All API helpers live in `src/lib/api.ts`; adjust once if your backend URL changes.
