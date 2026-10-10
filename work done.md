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
- Added a shared SQLite key-value persistence adapter for local-first state.

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
- Added player-relevant notification filtering for replies and mentions.

### Durable worlds and persistence

- Added a typed world model with active-world selection.
- Connected custom world creation to the durable world store.
- Persisted world metadata and Customize World settings.
- Persisted stories, story comments, viewed state, and likes.
- Persisted conversations, messages, events, progression, and activity logs.
- Added persisted typed notifications with unread state.
- Connected the notification tab badge to unread notification state.

### Settings-driven simulation

- Difficulty now scales event consequences.
- Madness Scale changes NPC activity and story frequency.
- Universe Stories controls NPC story creation.
- News Accounts controls news-account publishing.
- NPC likes, reposts, follows, replies, and relationship changes can generate notifications.
- Added focused tests for world rules and player-relevant replies.

### Reaction achievements

- Added typed achievement definitions and XP rewards.
- Awarded achievements from NPC replies, mentions, likes, reposts, follows, messages, story replies, and relationship changes.
- Added the Social Gravity milestone after multiple reaction achievements.
- Persisted unlocks per world.
- Added achievement notifications and activity-log records.
- Displayed unlocked achievements and earned XP on the Goals screen.
- Rebuilt the Goals screen around live event and achievement XP.
- Added shared level/progression calculations and locked achievement states.
- Replaced hardcoded milestone text and non-functional reward controls with live progression status.
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

### Runtime selector and profile navigation fix

- Stabilized the post-detail reply selector so missing reply collections do not create a new snapshot on every render.
- Kept the complete reply map as the Zustand selector input and memoized the selected post thread.
- Changed feed post cards so tapping an author does not open a profile directly.
- Kept profile navigation available from the opened post's author and from reply authors.
- Updated feed accessibility labels to describe post navigation accurately.

### X-style mention replies

- Added optional parent reply relationships to the reply model.
- Tapping Reply on a specific comment now pre-fills the composer with that author’s `@handle`.
- Added a visible “Replying to @handle” composer state.
- Added cancel-reply behavior.
- Stored the parent reply ID with submitted replies for future threaded rendering.

### Messaging persistence and interaction state

- Added typed chat message and conversation models.
- Moved the Ginny conversation into a shared Zustand message store.
- Preserved message history while navigating between the chat list and conversation.
- Added message delivery states for sending and read messages.
- Added read-state clearing when a conversation opens.
- Added simulated typing indicators and delayed character responses.
- Added lightweight context-aware responses based on message content.
- Updated the chat list to show the latest shared message and unread badge.

### Local-first completion pass

- Consolidated `/character/[id]` into the universal `/user/[id]` profile implementation.
- Added parent-aware reply indentation for nested replies.
- Added reply likes with local player state.
- Connected world-event relationship consequences to feed relationship state.
- Added safe local prototype boundaries for all planned social systems.
- Removed the obsolete Expo config field rejected by Expo Doctor.

### Local NPC intelligence

- Added NPC personality traits and speaking styles.
- Added short-term NPC memory records.
- Added a deterministic local NPC decision engine with ignore, reply, and post actions.
- Added bounded in-character response generation based on persona, relationship, target post, and memory.
- Connected generated NPC text to autonomous feed ticks.
- Documented the adapter boundary for replacing templates with an on-device language model later.

### Stories

- Added a local story store for player and NPC stories.
- Wired the feed story rail so Add story opens a composer and character bubbles open their own stories.
- Added image selection, text publishing, viewed-state styling, and story reply UI.

### World events and progression

- Added typed world event, choice, consequence, and progression models.
- Added a shared event store with seeded viral-rumor dilemma content.
- Added event choices that update Humor, Aura, Clout, Reputation, Social Savvy, XP, and completed-event count.
- Added optional relationship consequences to event choices for future relationship-store integration.
- Added a dedicated mobile world event screen.
- Connected the feed Activity action to the world event screen.
- Added a resolved-event state so choices cannot be applied twice.

### Activity and product-surface completion

- Added local roleplay activity creation and profile activity listing.
- Added functional story creation and character story opening.
- Added local search across seeded posts.
- Added local settings and store prototype screens.
- Wired app-hub search, settings, store, create-character, and feed store controls.
- Made add-character rows selectable.
- Added conversation banner dismissal, conversation actions feedback, and local message rating state.
- Corrected post replies so a direct post reply mentions the post creator, while a reply-to-reply mentions the selected reply author.

### Profile relationship and character-management polish

- Moved the Add a new character action outside Ginny's relationship card.
- Added centered diverging relationship meters to the player and character profile views.
- Positive relationship values extend right from neutral; negative values extend left.

### Feed ranking and NPC simulation

- Added engagement velocity to ranking so rapidly changing posts can rise without allowing large static counts to dominate forever.
- Added deterministic timestamp tie-breaking for stable feed ordering.
- Made player reach responsive to both post tension and author affinity.
- Added typed NPC archetypes, profiles, and relationship state.
- Added a controlled simulation tick that produces NPC posts and NPC replies.
- Added relationship affinity changes after simulated NPC interaction.
- Connected the feed screen to a cleaned-up 30-second simulation interval.

## Remaining work, in order

### Production integrations

The local-first prototype surface is complete. The following work requires external services or native product decisions:

- Add authentication, moderation/reporting, and privacy controls.
- Replace template NPC generation with an approved hosted or on-device model adapter.
- Add remote push notifications and background scheduling.
- Add real App Store purchases/subscriptions through a development build.
- Add media upload/CDN storage and production analytics.

### 1. Refine the feed engine

Status: Core implementation complete. Advanced balancing and persistence remain.

- Separate chronological mode from ranked mode.
- Add pagination or virtualized rendering when the feed grows.
- Add more tests for ranking and interaction changes.

### 2. Expand the reply system

- Support threaded replies with parent reply IDs.
- Add reply likes, reposts, and reply-specific reaction state.
- Add mention autocomplete and author context.
- Add server synchronization and moderation for replies.

### 3. Build the NPC simulation layer

Status: Core local simulation and settings integration complete. Broader autonomous behavior remains.

- Add narrative-day and event-aware triggers.
- Add background simulation scheduling independent of the feed screen.

### 4. Complete messaging

Status: Local prototype complete. Remote synchronization remains.

- Add branching dialogue based on player choices and relationships.
- Add server synchronization and background proactive DMs.

### 5. Add world events and progression

Status: Local prototype and persistence complete. Additional event content remains.

- Add randomized event cards.
- Add milestone thresholds and completed event chains.

### 6. Harden routes and data boundaries

Status: Local prototype complete.

- Validate route IDs and provide explicit not-found states.
- Replace duplicated profile data with a shared profile registry.
- Add loading and error boundaries for route-level failures.

### 7. Production readiness

Status: Local prototype complete; backend integration remains.

- Add backend synchronization.
- Add authentication and account ownership.
- Add media upload storage and moderation.
- Add accessibility labels and screen-reader verification.
- Add integration tests for core stores and critical navigation journeys.
- Run Expo Doctor and resolve remaining platform-specific warnings.
- Test Android, iOS, and web behavior independently.

### Documentation and bug audit

- Added `BUGS.md` with confirmed fixes and remaining technical debt.
- Documented the Goals progression model, achievement persistence, and current simulation limitations.

## Current limitations

- Store state is persisted locally but is not synchronized to an account or backend.
- Seeded content uses placeholder remote avatar and cover-image URLs.
- Chat messages are local and not synchronized.
- NPC simulation is deterministic and only runs while the feed screen is mounted.
- Reply likes and nested threads remain local-only.
- There is no authentication, backend, moderation, or push-notification service.
