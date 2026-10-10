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

The universal `/user/[id]` route is the preferred destination for feed authors, reply authors, and chat participants. The character route remains for the character-specific profile experience and should eventually be consolidated or made a compatibility route.

## State management

### Feed store

`stores/feedStore.ts` owns the social feed domain:

```text
FeedStore
  ├── posts
  ├── repliesByPost
  ├── playerStats
  ├── toggleLike(postId)
  ├── toggleRepost(postId)
  ├── addReply(postId, reply)
  ├── publishPost(post)
  └── getRankedPosts()
```

The store updates related values together. For example, liking a post updates the post like count, player likes-given count, reach, and narrative tension in one state transition.

Replies are currently normalized by post:

```ts
Record<string, Reply[]>
```

This supports fast post-detail rendering and gives the future backend a clear aggregation boundary. Nested threads should add `parentReplyId` rather than changing this basic model.

### Profile store

`stores/profileStore.ts` owns the player-controlled profile:

- Name
- Handle
- Bio
- Description
- Avatar URI
- Cover URI

The current store is local and intentionally small. Character/NPC profiles are currently seeded route data and should eventually move into a shared character registry or backend-backed store.

## Domain models

`types/feed.ts` contains the feed contract:

- `PostAuthorKind`
- `MediaAttachment`
- `Post`
- `Reply`
- `PlayerEngagementStats`

The `Post` model contains both social metrics and simulation inputs:

- `likes`, `reposts`, `comments`, `views`
- `tension`
- `affinity`
- `createdAt`
- player interaction flags

This lets the UI display conventional social metrics while the ranking engine uses simulation-specific signals.

## Feed ranking

`rankPosts()` currently calculates a weighted score from:

1. Freshness, decaying over 48 hours.
2. Logarithmic engagement.
3. Narrative tension.
4. Player interaction signals and author affinity.

The function returns a copied and sorted array so it does not mutate the store. As the feed grows, ranking should move toward memoized selectors, pagination, and explicit tie-breaking.

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
