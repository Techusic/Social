# Work Done and Remaining Work

This document is the implementation log and handoff checklist for the Social app.

## Completed

### Project foundation

- Configured Expo Router as the application entry point.
- Added a root stack navigator and a tab navigator.
- Added typed route support.
- Added NativeWind styling and shared dark mobile visual language.
- Configured Expo Image Picker permissions for gallery and camera use.
- Added Expo Font for vector icon compatibility.
- Added `userInterfaceStyle` configuration.
- Added ignore rules for dependencies, Expo output, build artifacts, native folders, and local npm configuration.

### Feed and post system

- Added typed post and media models in `types/feed.ts`.
- Added a Zustand feed store in `stores/feedStore.ts`.
- Seeded fictional posts from Ginny, Quidditch Stats, and Hermione.
- Added ranking based on freshness, engagement, narrative tension, affinity, likes, reposts, and replies.
- Added player interaction signals that affect post metrics, tension, reach, and ranking.
- Added like and repost actions.
- Added view, reply, repost, and like metrics.
- Added formatted handles and hashtags in post content.
- Added image attachments to posts.
- Added player post publishing through the post composer.
- Added a floating feed action menu with Activity and Post actions.
- Removed the earlier Event action as requested.

### Replies

- Added the typed `Reply` model.
- Moved replies from local post-detail component state into `useFeedStore`.
- Seeded the original post comments in the store.
- Added persistent in-memory `repliesByPost` state.
- Added reply creation with player metadata.
- Incremented post comment counts when a reply is created.
- Updated player reply statistics and reach.
- Added a reply composer with keyboard submit and send button.
- Made the main Reply action focus the composer.
- Added author navigation from replies to profile routes.
- Removed the previous reply limit.

### Profiles and characters

- Added player profile state in `stores/profileStore.ts`.
- Added editable name, bio, description, avatar, and cover image fields.
- Added the edit-profile screen and save flow.
- Added a universal author profile route at `app/user/[id].tsx`.
- Added the character profile route at `app/character/[id].tsx`.
- Added profile posts, relationship details, stories, follow-style controls, and messaging entry points.
- Added profile navigation from feed authors, post authors, commenters, and chat headers.
- Added the character catalog screen.
- Added custom character creation with required identity fields, photo selection, description, follower choices, public/private settings, and validation.

### Messaging

- Added the conversation screen.
- Added player and character message bubbles.
- Added timestamps, message rating affordances, emotional state, and relationship context.
- Added unlimited message sending.
- Added keyboard-aware message composition.
- Added navigation from the chat list and conversation header to the character profile.

### Runtime fixes

- Diagnosed the Expo Router route-loading error as a malformed JSX version of `PostCard`.
- Diagnosed the maximum update-depth error as an unstable Zustand selector created by filtering inside the selector.
- Fixed profile selectors by selecting the stable post collection and memoizing filtered posts.
- Verified that the Android bundle compiles after the fixes.

### Typography pass

- Reduced oversized feed post text.
- Reduced post-detail content and metadata.
- Reduced reply text and reply metrics.
- Reduced chat bubble text and message composer text.
- Preserved mobile touch target sizes while reducing visual density.

## Remaining work, in order

### 1. Refine the feed engine

- Separate chronological mode from ranked mode.
- Add stable tie-breaking by creation time.
- Add explicit reach/reaction formulas and NPC reaction thresholds.
- Add pagination or virtualized rendering when the feed grows.
- Add tests for ranking and interaction changes.

### 2. Expand the reply system

- Support threaded replies with parent reply IDs.
- Add reply likes, reposts, and reply-specific reaction state.
- Add mention autocomplete and author context.
- Add optimistic submission, error state, retry, and duplicate-submit protection.
- Persist replies through a database or API.

### 3. Build the NPC simulation layer

- Define persona, archetype, sentiment, relationship, frequency, and verification models.
- Add a simulation tick that creates posts, replies, DMs, defenses, and conflicts.
- Add bot-to-bot reactions.
- Add narrative-day and event-aware triggers.
- Add deterministic seeded simulation tests.

### 4. Complete messaging

- Move messages into a shared store.
- Add conversation IDs and participant metadata.
- Add typing indicators and read receipts.
- Add message delivery states.
- Add branching dialogue based on player choices and relationships.
- Add in-app notification badges for proactive DMs.

### 5. Add world events and progression

- Add randomized event cards.
- Add event choice models.
- Apply consequences to Humor, Aura, Clout Tokens, and relationships.
- Add milestone thresholds and completed event chains.
- Add a visible goals/progression state.

### 6. Harden routes and data boundaries

- Consolidate the legacy character route and universal user route where appropriate.
- Validate route IDs and provide explicit not-found states.
- Replace duplicated profile data with a shared profile registry.
- Add loading and error boundaries for route-level failures.

### 7. Production readiness

- Add persistence and backend synchronization.
- Add authentication and account ownership.
- Add media upload storage and moderation.
- Add accessibility labels and screen-reader verification.
- Add tests for core stores and critical navigation journeys.
- Run Expo Doctor and resolve remaining platform-specific warnings.
- Test Android, iOS, and web behavior independently.

## Current limitations

- Store state is in memory and resets on process restart.
- Seeded content uses placeholder remote avatar and cover-image URLs.
- Chat messages are local and not synchronized.
- NPC behavior is mostly static.
- Reply likes and nested threads are not implemented yet.
- There is no authentication, backend, moderation, or push-notification service.
