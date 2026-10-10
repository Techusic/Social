# Bug audit

## Fixed in this pass

- **Goals layout was structurally broken.** The achievements heading and card were nested inside the level header row, causing the Goals screen to collapse into an incorrect horizontal layout.
- **Goals progression was fake.** The screen always displayed level 7, 35 XP, and 3% regardless of persisted event or achievement progress.
- **Goals reward control was misleading.** “Claim Reward” had no handler and could not claim anything; it is now represented as a disabled, state-aware milestone status.
- **Achievements were incomplete on the Goals screen.** Only unlocked achievements were shown, so users had no way to distinguish locked milestones from missing data. The screen now displays every defined achievement.
- **Activity Log could be cleared accidentally.** The destructive clear action was removed previously, and activity entries are no longer truncated to 200 records.

## Known bugs and technical debt

- **NPC simulation is feed-screen scoped.** NPC activity pauses when the feed is unmounted or the app is backgrounded.
- **Store dependency cycle.** `messageStore` and `feedStore` import each other, which can expose initialization-order problems in a production build.
- **SafeAreaView warning.** Some screens still use the deprecated React Native `SafeAreaView` API and should consistently use `react-native-safe-area-context`.
- **Local-only state.** Worlds, messages, notifications, achievements, and activity logs are persisted on-device but are not synchronized to an account or backend.
- **Static achievement rewards.** Achievement unlocks are persisted, but reward claiming and a server-authoritative progression system do not yet exist.

