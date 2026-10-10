# Bug audit

## Fixed in this pass

- **Goals layout was structurally broken.** The achievements heading and card were nested inside the level header row, causing the Goals screen to collapse into an incorrect horizontal layout.
- **Goals progression was fake.** The screen always displayed level 7, 35 XP, and 3% regardless of persisted event or achievement progress.
- **Goals reward control was misleading.** “Claim Reward” had no handler and could not claim anything; it is now represented as a disabled, state-aware milestone status.
- **Achievements were incomplete on the Goals screen.** Only unlocked achievements were shown, so users had no way to distinguish locked milestones from missing data. The screen now displays every defined achievement.
- **Activity Log could be cleared accidentally.** The destructive clear action was removed previously, and activity entries are no longer truncated to 200 records.

## Known bugs and technical debt

- **Background NPC simulation.** NPC activity runs at app level while the app is active, but pauses when the app is backgrounded.
- **Store dependency cycle.** `messageStore` and `feedStore` import each other, which can expose initialization-order problems in a production build.
- **Safe-area migration.** Most touched screens use `react-native-safe-area-context`, but remaining screens should be audited for deprecated React Native `SafeAreaView` imports.
- **Local-only state.** Worlds, messages, notifications, achievements, and activity logs are persisted on-device but are not synchronized to an account or backend.
- **Static achievement rewards.** Achievement unlocks are persisted, but reward claiming and a server-authoritative progression system do not yet exist.
- **On-device model setup.** The first AI response requires an iOS development build and an internet connection to download the GGUF model; Expo Go uses the deterministic fallback. iOS native compilation requires macOS/Xcode locally or an EAS build.
- **Model download UX.** The app exposes loading/error status but does not yet show download percentage, model size, retry controls, or a model deletion/re-download action.
- **AI concurrency.** Public NPC text rewrites are currently launched asynchronously per generated item; a queue or rate limiter is needed for low-memory devices and longer simulation runs.

## Verification matrix

| Area | Verified on this workspace | Device-dependent follow-up |
| --- | --- | --- |
| TypeScript | Passed | None |
| Expo lint | Passed | None |
| Unit tests | 14 passing | Add integration coverage |
| iOS JavaScript export | Passed | None |
| Expo Doctor | 21/21 checks passed | Re-run after native dependency changes |
| Native iOS build | Not available on Windows | Build with Xcode or EAS |
| `llama.rn` inference | Not available in Expo Go | Test in an iOS development build |
