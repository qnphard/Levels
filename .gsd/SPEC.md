# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision

Levels is a mobile meditation and consciousness development app inspired by David R. Hawkins' work. It helps users reduce suffering and return to natural peace through short explanations, letting-go practices, and structured content organized around the Levels of Consciousness. The app feels like entering themed inner "spaces" rather than browsing a wiki.

## Goals

1. **Clarity for new users** — Make it obvious where to start, what's foundational vs. advanced, and provide a recommended flow.
2. **Immersive Level Rooms** — Each consciousness level feels like a themed environment with chambers, not a flat article page.
3. **Continuity between content** — Topics link together with "Next Suggested," "Related," and "Try Now" prompts.
4. **On-demand meditation audio** — Generate personalized meditation scripts with TTS (using Modal backend).
5. **Premium, glowing aesthetic** — Maintain the visually stunning, dark, luminous feel without sacrificing usability.

## Non-Goals (Out of Scope)

- AI-driven journaling "therapy" (journaling can exist, but not as AI-driven).
- Clinical hypnosis content.
- Enterprise features (teams, admin dashboards).
- Web version (mobile-first for now).

## Users

- **Primary**: Anyone seeking to reduce suffering, from complete beginners to advanced practitioners.
- **Secondary**: Users familiar with Hawkins' work who want a practical, portable companion.
- Users interact via short sessions (2–10 min practices) or deeper exploration of Level Rooms.

## Constraints

- **Technical**: React Native (Expo), Modal.com for TTS, Skia for graphics. Must work on Android.
- **Content**: All guidance must be Hawkins-accurate (no misattributions). Integrity Protocol applies.
- **UX**: Non-forceful, autonomy-respecting language. Invitations, not commands.
- **Timeline**: Phased delivery; prioritize clarity/UX fixes before new features.

## Success Criteria

- [ ] First-time user knows exactly where to start within 10 seconds of opening the app.
- [ ] Level Rooms feel like immersive environments (atmosphere persists, depth indicators present).
- [ ] Every topic ends with a clear "Next Suggested" action.
- [ ] TTS meditation generation works reliably (under 10s latency).
- [ ] App maintains 60fps performance on mid-range Android devices.
