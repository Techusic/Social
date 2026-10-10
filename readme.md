# Social

Social is a dark, mobile-first social simulation built with Expo and React Native. It combines a Twitter-style feed with fictional characters, relationship-aware interactions, direct messages, profiles, stories, goals, world selection, and character creation.

The current implementation is a local-first social simulation with Zustand state, SQLite persistence, and seeded fictional data. It includes a ranked Twitter-style feed, posts, replies, stories, character profiles, activities, direct messages, world events, progression, local NPC simulation, search, settings, notifications, and a persistent world model. Authentication, cloud AI, moderation, push notifications, and payments can be added behind adapters without replacing the navigation or UI foundations.

## Current stack

- Expo SDK 57
- React Native 0.86
- React 19
- Expo Router with typed routes
- TypeScript
- Zustand
- NativeWind/Tailwind styling
- Expo SQLite for local persistence
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
npm test
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
10. Add characters from the standalone profile action; relationship meters use a centered neutral baseline, with positive values extending right and negative values extending left.

## Documentation

- [Work completed and remaining work](./work%20done.md)
- [Architecture](./architecture.md)
- [Bug audit](./BUGS.md)

## Local persistence

The app stores its local-first state in the `social-feed.db` SQLite database. The shared key-value adapter is [db/worldPersistence.ts](./db/worldPersistence.ts).

Persisted domains include:

- Active worlds and Customize World settings through [stores/worldStore.ts](./stores/worldStore.ts)
- Feed posts, replies, relationships, memories, simulation tick, and feed mode through [db/feedPersistence.ts](./db/feedPersistence.ts)
- Stories, story comments, viewed state, and likes through [stores/storyStore.ts](./stores/storyStore.ts)
- Conversations and messages through [stores/messageStore.ts](./stores/messageStore.ts)
- Events and player progression through [stores/eventStore.ts](./stores/eventStore.ts)
- Activity history through [stores/activityLogStore.ts](./stores/activityLogStore.ts)
- Typed unread notifications through [stores/notificationStore.ts](./stores/notificationStore.ts)
- Achievement unlocks and earned XP through [stores/achievementStore.ts](./stores/achievementStore.ts)

Persistence is device-local and is not account synchronization. Clearing app data or uninstalling the app removes this local database.

## World and NPC behavior

[stores/worldStore.ts](./stores/worldStore.ts) owns the active world and its settings. [stores/feedStore.ts](./stores/feedStore.ts) reads those settings during each NPC simulation tick:

- Difficulty scales event consequences.
- Madness scale changes NPC activity and story frequency.
- Universe Stories controls NPC story creation.
- News Accounts controls news-account publishing.
- Player-facing NPC actions create persisted notifications and can unlock achievements.

The feed runs a simulation tick every 30 seconds while the feed screen is mounted. Each tick evaluates the NPC's persona, relationship, memories, target post, and active-world settings before choosing an action.

The app hub world picker switches the active world. Switching worlds hydrates each persisted store from that world's namespace, so feed content, stories, messages, events, logs, notifications, and simulation progress do not mix between worlds.

NPCs can interact with the player and with other characters. Depending on relationships, target posts, and world settings, they can publish posts, reply with mentions, like or repost player posts, follow the player, send unsolicited direct messages, and reply to player stories.

NPC reactions can unlock persisted achievements such as The Conversation Starts, Name in the Feed, Quiet Approval, Passed Along, People Are Watching, An Owl Arrives, Story Reaction, Something Changed, and Social Gravity. Each achievement grants XP, records an activity-log entry, and creates an achievement notification. Unlocks are isolated per world.

The Goals screen combines event XP and achievement XP into a live level, displays progress toward the next level, lists locked and unlocked achievements, and shows the next available milestone. Progression calculations are shared through [utils/progression.ts](./utils/progression.ts).

## Project status

The local prototype is functionally complete for its current scope. World, feed, story, message, event, activity-log, and notification state persist locally. The NPC layer is deterministic and local-first: persona traits, memories, relationship context, and world settings drive autonomous actions and template-based text generation. Backend synchronization, an optional neural on-device model, remote push notifications, moderation, authentication, and App Store payments remain integration work rather than missing local UI.
