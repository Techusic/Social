# Social

Social is a dark, mobile-first social simulation built with Expo and React Native. It combines a Twitter-style feed with fictional characters, relationship-aware interactions, direct messages, profiles, stories, goals, world selection, and character creation.

The current implementation is a front-end prototype with local Zustand state and seeded fictional data. It is designed so the simulation systems can be expanded without replacing the navigation or UI foundations.

## Current stack

- Expo SDK 57
- React Native 0.86
- React 19
- Expo Router with typed routes
- TypeScript
- Zustand
- NativeWind/Tailwind styling
- Expo Image Picker for post and character media
- Expo Vector Icons and Expo Font

## Getting started

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run start
```

Useful platform commands:

```powershell
npm run android
npm run ios
npm run web
```

For a clean Metro cache when route or module errors appear:

```powershell
npx expo start -c
```

## Validation

Run the project checks before committing:

```powershell
npx tsc --noEmit
npx expo lint
npx expo export --platform android
```

## Main user flows

1. Open the app hub from `app/index.tsx`.
2. Tap **Play** to enter the social feed.
3. Browse ranked posts and interact with likes, reposts, replies, and profiles.
4. Open a post to read its thread and publish a reply.
5. Open Messages to view the conversation interface.
6. Open Profile to edit the player profile or add a character.
7. Create a custom character with a photo, identity, bio, description, and privacy setting.

## Documentation

- [Work completed and remaining work](./work%20done.md)
- [Architecture](./architecture.md)

## Project status

The core navigation and interaction prototype is working. Feed and reply state currently lives in memory, so it resets when the app process is restarted. Persistence, backend integration, autonomous NPC simulation, push notifications, and production authentication are still planned.
