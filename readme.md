# Social

Social is a dark, mobile-first social simulation built with Expo and React Native. It combines a Twitter-style feed with fictional characters, relationship-aware interactions, direct messages, profiles, stories, goals, world selection, and character creation.

The current implementation is a local-first prototype with Zustand state and seeded fictional data. It includes a ranked Twitter-style feed, posts, replies, stories, character profiles, activities, direct messages, world events, progression, local NPC simulation, search, settings, and a prototype store. It is designed so persistence, authentication, cloud AI, moderation, push notifications, and payments can be added behind adapters without replacing the navigation or UI foundations.

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
8. Open Profile → Activities to create planned roleplay activities.
9. Use Search, Store, and Settings from the app hub and feed.

## Documentation

- [Work completed and remaining work](./work%20done.md)
- [Architecture](./architecture.md)

## Project status

The local prototype is functionally complete for its current scope. State resets when the app process is restarted. The NPC layer is deterministic and local-first: persona traits, memories, and relationship context drive autonomous actions and template-based text generation. Production persistence, backend integration, an optional neural on-device model, push notifications, moderation, authentication, and App Store payments remain integration work rather than missing local UI.
