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
   * Alternative: edit `app.json` -> `expo.extra.apiBase`.
3. Run the dev server:
   ```bash
   npm start
   ```
   Use the Expo Go app (physical device) or an Android/iOS emulator to load the QR/URL.

## Features

- Auth: login/register flows persist JWT using SecureStore/AsyncStorage.
- Dashboard: displays proficiency progress and best scores per task.
- Tasks: browse tasks, drill into details, start/stop a timer, pick a standard, select error checkboxes, and submit an attempt.
- Leaderboard: global ranking from `/leaderboard/global`.
- Profile: view account details and sign out.

## Preparing for Google Play (native Gradle build)

1. Set your production API host (required for a usable build):
   ```bash
   # PowerShell example
   $env:EXPO_PUBLIC_API_BASE_URL="https://your-api-host"
   ```
2. Provide release signing values (required for Play uploads):
   * Preferred: export env vars `ANDROID_KEYSTORE_PATH`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
   * Or copy `android/keystore.properties.example` to `android/keystore.properties` and fill in the same values (file is git-ignored).
   * Place your upload keystore at the path you set above (default: `android/app/upload-keystore.jks`).
3. Build the Play bundle (AAB):
   ```bash
   npm run android:release
   ```
   Outputs:
   * AAB: `android/app/build/outputs/bundle/release/app-release.aab` (upload this to Play Console)
   * APK: `android/app/build/outputs/apk/release/app-release.apk` (for side-loading/testing)
4. Upload the `.aab` to the Google Play Console, complete policy forms, and publish.
5. Branding assets: add your own app icon and splash artwork under `mobile/assets/` (ignored by Git) and wire them into `app.json` before shipping to Play.

## Notes

- The timer uses device time to generate `started_at`/`ended_at` timestamps for the FastAPI scoring endpoint.
- All API helpers live in `src/lib/api.ts`; adjust once if your backend URL changes.
