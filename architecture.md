# Architecture

## Overview

Social is an Expo Router application organized around route screens, reusable UI components, typed domain models, and Zustand stores.

```text
Expo entry
  └── app/_layout.tsx
      ├── app/index.tsx                 App hub / world selection
      ├── app/(tabs)/_layout.tsx        Main tab navigator
      │   ├── feed.tsx                  Ranked social feed
      │   ├── goals.tsx                 Progression surface
      │   ├── chat.tsx                  Conversation list
      │   ├── notifications.tsx         Notification surface
      │   └── profile.tsx                Player profile
      ├── app/post/[id].tsx             Post detail and reply thread
      ├── app/user/[id].tsx             Universal profile route
      ├── app/character/[id].tsx        Character profile route
      ├── app/conversation.tsx          Direct conversation
      ├── app/create-post.tsx            Post composer
      ├── app/edit-profile.tsx           Player profile editor
      ├── app/add-character.tsx          Character catalog
      └── app/create-character.tsx       Custom character creator
```

## Routing

Expo Router uses the filesystem under `app/` as the route tree.

- `_layout.tsx` files define navigators.
- `(tabs)` is a route group and does not appear in URLs.
- `[id].tsx` files define dynamic routes.
- `router.push()` is used for forward navigation.
- `router.back()` returns to the previous screen.
- Profile and post IDs are passed through typed route parameters.

The universal `/user/[id]` route is the destination for feed authors, reply authors, and chat participants. `/character/[id]` is now a compatibility alias that renders the universal profile implementation, preventing the two profile experiences from drifting.

## State management

### Feed store

`stores/feedStore.ts` owns the social feed domain:

```text
FeedStore
  ├── posts
  ├── repliesByPost
  ├── relationships
  ├── simulationTick
  ├── playerStats
  ├── toggleLike(postId)
  ├── toggleRepost(postId)
  ├── addReply(postId, reply)
  ├── publishPost(post)
  └── getRankedPosts()
  └── simulateNpcTick()
```

The store updates related values together. For example, liking a post updates the post like count, player likes-given count, reach, and narrative tension in one state transition.

Replies are currently normalized by post:

```ts
Record<string, Reply[]>
```

This supports fast post-detail rendering and gives the future backend a clear aggregation boundary. Nested threads should add `parentReplyId` rather than changing this basic model.

### Durable world store

`stores/worldStore.ts` is the root of the local world model. It stores:

- World identity and metadata
- The active world ID
- Privacy and cover settings
- Gameplay settings
- Story and NPC guidance
- News behavior

World creation uses `createWorld()` and immediately activates the new world. Customize World writes through `updateWorld()` and `updateSettings()` rather than keeping screen-only values.

The store persists through the shared SQLite key-value adapter:

```text
worldStore
  └── db/worldPersistence.ts
      └── social_store
```

Other stores currently use the same adapter with separate keys. Feed persistence remains in `db/feedPersistence.ts` because it has a larger typed snapshot and its own hydration contract.

### Persisted stores

| Store | Persistence key | Stored data |
| --- | --- | --- |
| `worldStore` | `worlds` | Worlds, active world |
| `storyStore` | `stories` | Stories, comments, likes, viewed state |
| `messageStore` | `messages` | Conversations and messages |
| `eventStore` | `events` | Event completion and player progression |
| `activityLogStore` | `activity-log` | Recent world activity |
| `notificationStore` | `notifications` | Typed notifications and read state |
| `achievementStore` | `achievements` | Unlocked achievements and earned XP |

Each store hydrates synchronously when its module is loaded and writes its updated state after mutations. The persistence boundary is intentionally local-first; account sync and conflict resolution are future backend responsibilities.

### Notifications

`stores/notificationStore.ts` owns typed player-facing notifications. Supported types include replies, mentions, likes, reposts, follows, story replies, messages, relationship changes, event outcomes, and achievement unlocks.

Notifications are persisted independently from the feed so the unread badge survives navigation and app restarts. The tab layout derives its badge from unread records, and the notifications screen marks records read when opened.

### World switching and character conversation

World-scoped keys use the format `world:<worldId>:<store>`. The world store notifies registered hydrators when `activeWorldId` changes. Each persisted store reloads its namespace synchronously, while the feed uses its typed snapshot adapter.

The NPC simulation is a shared conversation boundary rather than a feed-only generator. A tick may:

- Reply to a player or NPC post.
- Address the player with `@raghav`.
- Create a player-facing like, repost, follow, or relationship notification.
- Send an unsolicited direct message through `messageStore`.
- Comment on a player story through `storyStore`.

This keeps public posts, stories, direct messages, notifications, and relationship state connected to the same world tick.

### Achievements

`stores/achievementStore.ts` evaluates reaction milestones at the point where NPC behavior reaches the player:

- Public reply and `@raghav` mention
- Like, repost, or follow
- Unsolicited direct message
- Story reply
- Meaningful relationship change
- Five unlocked reaction milestones

Achievement definitions and XP rewards are typed in `types/achievements.ts`. Unlocks are persisted under the active world namespace, added to the Goals screen, recorded in the activity log, and surfaced as notifications.

### Goals and progression

`app/(tabs)/goals.tsx` is a read-only projection of persisted event and achievement state. `utils/progression.ts` converts combined XP into a level, current-level XP, and normalized progress toward the next level. The screen renders every achievement definition so locked milestones remain visible, while unlocked achievements show their earned XP. It also summarizes completed world events and the next achievement milestone without exposing non-functional reward actions.

### Profile store

`stores/profileStore.ts` owns the player-controlled profile:

- Name
- Handle
- Bio
- Description
- Avatar URI
- Cover URI

The current store is local and intentionally small. Character/NPC profiles are currently seeded route data and should eventually move into a shared character registry or backend-backed store.

### Message store

`stores/messageStore.ts` owns conversation state independently from the conversation screen:

- Conversation participant metadata.
- Ordered chat messages.
- Message delivery state.
- Unread count.
- Typing indicator.
- Relationship mood and delta.

The conversation screen subscribes to the store and only manages the current draft. Sending a message creates a local `sending` message, transitions it to `read`, briefly enables typing, and then appends a deterministic character response. This is a local simulation of the eventual message API boundary.

### Event store

`stores/eventStore.ts` owns world-event state:

- Active event and available choices.
- Choice consequences.
- Player progression stats.
- Completed event count and XP.

The event screen renders choices without owning progression mutations. `resolveEvent()` applies each choice once and marks the event complete. Relationship deltas are carried by the choice model so they can later be dispatched to the relationship store without coupling the event UI to NPC logic.

### Local NPC intelligence

`utils/npcEngine.ts` is the local decision and language boundary for NPC behavior. It does not mutate game state or invent consequences. It receives a bounded context containing persona traits, relationship state, target post, memories, and simulation tick, then returns an action (`ignore`, `reply`, or `post`) and short in-character text.

This hybrid design keeps behavior coherent:

```text
Persona + relationship + memory + tension
                ↓
        deterministic decision
                ↓
        local response generator
                ↓
     store validates and applies changes
```

The response generator is currently a lightweight offline adapter with templates. A future on-device language model can replace `generateNpcText()` without changing the store or UI contracts.

### Activities and utility surfaces

`stores/activityStore.ts` owns planned roleplay activities created from `app/create-activity.tsx`. The profile Activities tab reads this shared state, while `search.tsx`, `settings.tsx`, and `store.tsx` provide local prototype surfaces for discovery, preferences, and energy/power-up concepts. These screens intentionally use local alerts or navigation instead of claiming to process real purchases or cloud account changes.

### Profile relationship meters

Relationship meters are rendered as diverging bars. The center line represents neutral chemistry; positive affinity grows to the right and negative affinity grows to the left. The add-character action is kept outside individual relationship cards so character management is not coupled to Ginny or any other NPC.

## Domain models

`types/feed.ts` contains the feed contract:

- `PostAuthorKind`
- `MediaAttachment`
- `Post`
- `Reply`
- `PlayerEngagementStats`

The `Post` model contains both social metrics and simulation inputs:

- `likes`, `reposts`, `comments`, `views`
- `likedByPlayer`, `reposts`, `comments`, `views`
- `tension`
- `affinity`
- `createdAt`
- player interaction flags

This lets the UI display conventional social metrics while the ranking engine uses simulation-specific signals.

## Feed ranking

`rankPosts()` currently calculates a weighted score from:

1. Freshness, decaying over 48 hours.
2. Logarithmic engagement.
3. Engagement velocity relative to views.
4. Narrative tension.
5. Player interaction signals and author affinity.

The function returns a copied and sorted array so it does not mutate the store. Near-equal scores are tied by creation time, which keeps the feed stable between renders.

Player reach is updated from the post's tension and author affinity. Likes, reposts, and replies therefore contribute different amounts of reach depending on the narrative importance and relationship context of the post.

## NPC simulation

NPC profiles currently contain:

- Archetype: rival, ally, authority, or commentator.
- Verification and posting frequency.
- Baseline sentiment.
- Relationship affinity and sentiment.

`simulateNpcTick()` is intentionally deterministic for the local prototype. It rotates through known NPCs, targets an existing post, and chooses among ignoring, replying, or publishing based on persona traits, relationship pressure, memories, target tension, simulation tick, and active-world settings. Reactions can extend across posts, stories, direct messages, follows, likes, reposts, and relationship changes. The feed screen runs one tick every 30 seconds while it is mounted and cleans up the timer when it unmounts.

The tick is a local simulation boundary. Message and story stores subscribe through explicit reaction methods, while the achievement store evaluates player-facing milestones at the point each reaction is applied.

## UI composition

`components/PostCard.tsx` is the primary reusable feed surface. It receives callbacks rather than owning navigation or store mutations:

```text
PostCard
  ├── onLike
  ├── onRepost
  ├── onReply
  ├── onOpen
  └── onAuthor
```

This keeps the component reusable on the feed, profile, and future search surfaces.

Screen responsibilities:

- Screens read route parameters and connect UI events to stores.
- Components render content and expose interaction callbacks.
- Stores own cross-screen state transitions.
- Types define the shared contract between stores and UI.

## Media

The post and character creation flows use Expo Image Picker. Selected assets are currently represented as local URI-based media attachments. A production implementation should upload those assets, store stable URLs, and handle upload progress and failure states.

## Styling and platform behavior

The app uses NativeWind classes with React Native components. The visual system is:

- Dark backgrounds and elevated gray surfaces.
- Blue primary actions.
- Rounded mobile cards and pills.
- Compact social typography.
- Safe-area-aware screens.
- Keyboard-aware post and message composers.

Platform-sensitive behavior should remain in screen-level wrappers, such as `KeyboardAvoidingView` behavior differences between iOS and Android.

## Data flow examples

### Like a post

```text
Feed screen
  → PostCard.onLike
  → feedStore.toggleLike(postId)
  → update post metrics and player stats
  → Feed screen re-renders
  → rankPosts(posts) changes ordering if needed
```

### Publish a reply

```text
Post detail
  → TextInput draft
  → addReply(postId, reply)
  → append repliesByPost[postId]
  → increment Post.comments
  → update playerStats
  → reply appears immediately in the thread
```

### Open an author

```text
PostCard.onAuthor
  → router.push('/user/[id]')
  → route reads id
  → profile registry/fallback resolves profile
  → profile renders matching posts from feedStore
```

## Planned evolution

The intended production architecture is:

```text
Screens and components
        ↓
Zustand domain stores
        ↓
Repository/API layer
        ↓
Authentication, database, media storage,
notifications, and simulation workers
```

The repository/API layer should be introduced before adding backend calls directly inside screens. That will preserve the current UI contracts while allowing local mock data, offline state, and remote synchronization to share the same interfaces.
