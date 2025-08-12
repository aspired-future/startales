# UI Visual Design — Galactic Tale Weaver RPG

## Design Goals
- Voice-first, readable at a glance, minimal friction
- Fast comprehension: clear focus panel, concise HUD, high-contrast captions
- Scalable layout for 1280×800 up to ultrawide; responsive to 1024×640
- Consistent art style (scene/portrait/item) with unobtrusive chrome
- Accessible: keyboardable, captions, ARIA roles, color-contrast compliant

## Information Architecture (Session View)
- Primary focus: Scene (image/video + short narration)
- Secondary: Objectives HUD, Channel/Party, Transcript, Achievements toasts
- Utility: Map/Timeline notes (CRDT), Inventory/Artifacts, Settings

## Global Layout (Desktop, default)
```
┌─────────────────────────── Top Bar ───────────────────────────┐
│  Campaign ▼   Mission: Echoes of the Dyson Gate   Clock 19:45 │
│  Providers: OpenAI | Ollama   Voice: PTT [Space]   Settings ⚙ │
└───────────────────────────────────────────────────────────────┘
┌──────── Left Rail ────────┬──────────── Scene Panel ───────────┬──── Right Rail ────┐
│ Channels                   │  [Scene Image/Video 1024×576]     │ Objectives         │
│ - Global (muted)           │  Caption: "Ion storm flashes..."   │ - Reach Gate       │
│ - Party (live) ●           │------------------------------------│ - Scan emissions   │
│ - Alliance (idle)          │  NPC Roster (portraits)            │ - Parley Envoy     │
│ - Ad-hoc: Ops-brief (inv)  │  Quick Intents: [Scan] [Parley]…   │ Twists / Status    │
│ + New channel              │                                    │ Situation Ticker   │
│                             │                                    │ "Update: …"        │
│ Party/Alliances            │                                    │ Achievements Toasts│
│  • You (PTT)  • Kael       │                                    │ (stack, auto-hide) │
│  • Nysa  • Rho             │                                    │                     │
└────────────────────────────┴────────────────────────────────────┴─────────────────────┘
┌──────────────────────── Transcript / Chat / Logbook ─────────────────────────┐
│ [You] "We angle toward the Gate and run a low-power scan."                   │
│ [GM]  (d20+Int+Hacking=18 vs DC15) Success. Emissions resolve to...           │
│ [NPC Envoy] "We can help, for a price."                                      │
│                                                                                │
│  [Mic ◉] [Send]  (Push-to-talk / VAD)   Attach: Item/Clip   Channel: Party ▼  │
└───────────────────────────────────────────────────────────────────────────────┘
```

Notes
- Left Rail: Channels list + Party/Alliances quick panel; ad-hoc invites appear with badge
- Scene Panel: hero media, single-line caption, NPC roster, quick intents
- Right Rail: Objectives with progress, twists/states, situation ticker, achievements toasts stack
- Bottom: unified transcript/chat/logbook with channel selector

## Key Screens

### A. Lobby / Campaign Browser
```
┌ Campaigns ────────────────────────────┐   ┌ Schedule (selected) ────────────┐
│ + New Campaign [preset: Depth]        │   │ Next: Fri 7pm (2h), RRULE: Wkly │
│ • Orion Arm Frontier (Active)         │   │ Invites sent to 4 members        │
│ • Verdant Nebula (Archived)           │   │ [Join when ready]                │
└───────────────────────────────────────┘   └──────────────────────────────────┘
```

### B. Channel Manager (Modal)
```
┌ New Channel ────────────────────────────────┐
│ Name: Ops-brief                             │
│ Type: Voice + Text   Invite-only: [x]       │
│ Invite: [Kael] [Nysa] [Rho]                 │
│ Roles: Owner (You), Mods: [Kael]            │
│ [Create] [Cancel]                            │
└──────────────────────────────────────────────┘
```

### C. Achievements Panel
```
┌ Achievements (Player | Crew)  [All | Unlocked | Locked]  Category: All ┐
│ [Icon] First Steps    Common   1/1   Reward: 100 XP       [Unlocked]   │
│ [Icon] Skillful       Rare     6/10  Reward: Title        [Progress →] │
│ [Icon] Relic Hunter   Epic     2/3   Reward: Item         [Locked]     │
└─────────────────────────────────────────────────────────────────────────┘
```

### D. Settings (Preset)
```
┌ Preset: Subscription/Depth (Default) ───────────────────────────┐
│ Points visibility: Private (i)                                   │
│ Leaderboards: Off (switch to Competitive to enable)              │
│ Fail-forward strictness: Strict  (Strict | Lenient | Off)        │
│ Providers:  LLM [OpenAI▼]  Alt [Ollama▼]  STT [Whisper▼]         │
└──────────────────────────────────────────────────────────────────┘
```

### E. Campaign Setup (Resolution & Revial Options)
```
┌ New Campaign Setup ──────────────────────────────────────────────────┐
│ Name: [____________________]                                         │
│ World/Mission Pack: [Orion Arm Frontier ▼]                           │
│ Resolution Mode:  (•) Outcome Meter   ( ) Classic d20                │
│ Revial Options:   (•) Standard  ( ) Story/Casual  ( ) Hardcore       │
│  ⓘ Standard: clone/backup with minor costs; Story: limited rewinds;  │
│     Hardcore: permadeath                                             │
│ [Create] [Cancel]                                                    │
└──────────────────────────────────────────────────────────────────────┘
```

Test IDs:
- `data-testid="setup-name"`
- `data-testid="setup-pack"`
- `data-testid="setup-resolution-outcome"`
- `data-testid="setup-resolution-classic"`
- `data-testid="setup-revial-standard|story|hardcore"`
- `data-testid="setup-submit"`

### F. Death Clock HUD
```
┌ Death Clock ───────────────────────┐   Momentum: 3  [Spend]          
│ ████████░░  12s                    │   Actions: [Stabilize] [Extract]
│ Status: Downed (Bleeding)          │   Costs:   +1 supply, -1 edge   
└────────────────────────────────────┘                                  
```

- Shows remaining time, status effects, and available actions (stabilize/extract/boost) with costs.
- Compatible with Outcome Meter: spending momentum previews band shift and pauses clock.
- Hardcore confirmation prompts before lethal outcomes.

Test IDs:
- `data-testid="death-clock"`
- `data-testid="death-clock-time"`
- `data-testid="death-clock-actions"`
- `data-testid="hardcore-confirm"`

## Component Inventory
- TopBar: campaign selector, mission title, provider indicators, PTT status, settings
- ChannelsList: channels, statuses, invite badges, new channel button
- PartyPanel: members with PTT status and health/status icons
- SceneMedia: image/video with caption; loading placeholder with shimmer; error fallback
- NPCRoster: small portraits with tooltips and quick “talk to” intent
- QuickIntentsBar: per-context macros (configurable)
- ObjectivesPanel: objective list with progress, twists, situation ticker card
- AchievementsToasts: queue manager with batching and aria-live announcements
- TranscriptChat: mixed transcript, channel selector, mic/send controls, attachments
- MapTimelinePanel: CRDT notes pins and timeline events
- Modal: ChannelManager, InviteDialog, ShareDialog
 - VictoryDashboard: weighted objectives progress, timer countdown, criteria details
 - LeaderboardPanel: campaign alliances and individuals boards; filters (scope, timeframe, region), pagination, search
 - GlobalLeaderboardView: opt-in global users board with privacy notice and filters
 - AlienCompendium: species catalog (non-humanoid emphasis) with portraits and morphology/physiology tags

### Outcome Meter HUD (Default Resolution)
- Bands: Fail | Complication | Success | Critical Success; color-coded with accessible contrasts.
- Chance Bar: horizontal bar with live percent and modifier pills; shows expected cost if Complication triggered.
- Modifiers List: collapsible list detailing sources (skill, attribute, gear, status, clocks, momentum).
- Momentum/Edge: visible current value with [+]/Spend controls; spending previews band shift.
- Risk Preview: before commit, shows consequence tiers; updates as Momentum is toggled.
- Classic Toggle: switches to visible d20 and modifiers; persists per campaign/session.

Interaction & Accessibility
- Keyboard: open Outcome Meter (Alt+O), toggle Classic (Alt+C), spend Momentum (Alt+M).
- Screen readers: announce current band, chance, and expected costs; modifier pills have tooltips and aria labels.

Test IDs (Playwright)
- `data-testid="outcome-meter"`
- `data-testid="outcome-band-fail|complication|success|critical"`
- `data-testid="outcome-chance-bar"`
- `data-testid="outcome-modifiers"`
- `data-testid="momentum-controls"`
- `data-testid="classic-toggle"`

## States & Edge Cases
- Loading: skeletons for media/panels; spinner for provider calls; channel states optimistic
- Empty: friendly copy for no objectives/achievements yet; CTA to start a mission
- Error: inline error with retry; provider banner when model key missing
- Voice: PTT pressed state, VAD active meter; per-channel mute; global channel muted by default
- Accessibility: captions always available; keyboard shortcuts (PTT=Space, Switch Channel=Ctrl+Tab)

## Theming & Tokens
- Base: Tailwind (or CSS vars) with theme tokens: `--bg`, `--panel`, `--muted`, `--accent`, `--success`, `--warning`, `--danger`
- Shadows subtle; rounded md; 8px spacing grid
- Dark theme default; light theme optional

## Test IDs (Playwright)
- Scene media: `data-testid="scene-media"`
- Caption: `data-testid="scene-caption"`
- Objectives: `data-testid="mission-objectives"`
- Situation ticker: `data-testid="situation-ticker"`
- Channels list: `data-testid="channels-list"`
- New channel button: `data-testid="new-channel-btn"`
- Invite dialog: `data-testid="invite-dialog"`
- Achievements panel: `data-testid="achievements-panel"`
- Unlock toast: `data-testid="unlock-toast"`
- Transcript input: `data-testid="transcript-input"`
- PTT button: `data-testid="ptt-button"`

## Open Questions
- Do we prefer left or right placement for Map/Timeline by default?
- Should global channel auto-join with listen-only? (Current: muted by default.)
- What is the acceptable max height for transcript before compact mode engages?

---

## Page Flow (Mermaid)

```mermaid
flowchart LR
    A[Campaign Browser] -->|Join| B[Session View]
    B --> C[Channel Manager]
    B --> D[Achievements Panel]
    B --> E[Settings]
    B --> F[Map/Timeline]
```

## Component Hierarchy (Mermaid)

```mermaid
graph TD
  App --> TopBar
  App --> MainGrid
  MainGrid --> LeftRail[Left Rail]
  MainGrid --> ScenePanel[Scene Panel]
  MainGrid --> RightRail[Right Rail]
  LeftRail --> ChannelsList
  LeftRail --> PartyPanel
  ScenePanel --> SceneMedia
  ScenePanel --> NPCRoster
  ScenePanel --> QuickIntents
  RightRail --> ObjectivesPanel
  RightRail --> SituationTicker
  RightRail --> AchievementsToasts
  App --> TranscriptChat
  App --> Modals[Modals: ChannelManager, InviteDialog]
```

## Mobile/Small View (compact)
- Collapse rails into drawers (left=Channels/Party, right=Objectives)
- Scene as primary; transcript as swipe-up bottom sheet
- Floating mic button; quick intents as pill row over media
