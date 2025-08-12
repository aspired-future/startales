import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TASKS_PATH = path.resolve(__dirname, '..', '.taskmaster', 'tasks', 'tasks.json');

const patterns = [
  {
    re: /Voice Capture, VAD, STT Pipeline with Captions/i,
    demo: 'Demo: Two clients join, speak, receive GM reply with caption (Playwright smoke).'
  },
  {
    re: /React UI Shell and Campaign Browser/i,
    demo: 'Demo: All components render with test IDs and skeletons.'
  },
  {
    re: /Local SQLite and Vector Index Setup/i,
    demo: 'Demo: Save → resume → branch timeline.'
  },
  {
    re: /Vector Memory with Per-Player Privacy and Campaign Memory/i,
    demo: 'Demo: Private vs campaign recall proven.'
  },
  {
    re: /Alliances\/Teams and Leaderboards/i,
    demo: 'Demo: Create/join alliance, shared stash flow.'
  },
  // Narrative scaffolding
  {
    re: /Director Model/i,
    demo: 'Demo: Beat transitions visible; pacing guards enforced.'
  },
  {
    re: /Story Decks/i,
    demo: 'Demo: Rising → Twist injection visible in HUD + recap.'
  },
  {
    re: /DDA/i,
    demo: 'Demo: Scaling within configured safety bounds.'
  },
  // Tech trees
  {
    re: /Tech Tree/i,
    demo: 'Demo: Start research; unlock QoL/cosmetic node.'
  },
  // Stage/Fireteams/Large session
  {
    re: /Stage Mode|raise-?hand|speaker roster/i,
    demo: 'Demo: Request to speak → moderator approval → speaker roster update.'
  },
  {
    re: /Fireteam|Squad/i,
    demo: 'Demo: Create squads; voice isolated per team.'
  },
  {
    re: /Batching|50 participants|performance tuning/i,
    demo: 'Demo: GM summary median < 4.5s at ~50 simulated clients.'
  },
  {
    re: /Spectator|Cast/i,
    demo: 'Demo: Spectator receives captions with spoiler guard enabled.'
  },
  // Live Ops / Shareables / Monetization
  {
    re: /Daily Contract/i,
    demo: 'Demo: Contract cycles and rewards granted.'
  },
  {
    re: /Anomaly|Mutator/i,
    demo: 'Demo: Anomaly impacts rules; teardown restores defaults.'
  },
  {
    re: /Recap/i,
    demo: 'Demo: Shareable recap generated with seed reproducible.'
  },
  {
    re: /Season Pass|Cosmetic|Entitlement|Store/i,
    demo: 'Demo: Cosmetic renders by entitlement; pass progression and prestige preserved.'
  },
  {
    re: /Cost telemetry/i,
    demo: 'Demo: Dashboard snapshot shows tokens/STT/TTS/images and cost projection.'
  },
  // Solo
  {
    re: /Single Player|Solo/i,
    demo: 'Demo: Pause → resume resumes identical state; companion acts; solo DDA within bounds.'
  },
  // Simulation
  {
    re: /SimulationProvider|Simulation Provider/i,
    demo: 'Demo: Deterministic seed yields reproducible step outputs.'
  },
  {
    re: /\/.?simulation|snapshot export|snapshot import/i,
    demo: 'Demo: Snapshot export/import timeline shown.'
  },
  {
    re: /Reconciliation/i,
    demo: 'Demo: Mission progression from simulation events; invariants hold.'
  },
  {
    re: /Consistency|drift|state hash/i,
    demo: 'Demo: Hash timeline logged; induced drift triggers replay then fallback.'
  },
  // Visibility & Moderation
  {
    re: /Invite|Join Code|Approval|Moderation|Kick|Ban|Role|Visibility|Public Browser|Open Game/i,
    demo: 'Demo: Invite-only join via invite link and join code; public browser discoverability; owner/mod approval queue; moderation (kick/ban/role change) audited.'
  },
  // Creation Flows (AI Wizard & Presets)
  {
    re: /Create Campaign|Campaign Wizard|Story Wizard|AI Wizard|Preset|System-created/i,
    demo: 'Demo: Create preset game; create manual game via AI wizard; choose Outcome Meter vs Classic in setup; mission DSL scaffold loads and first session progresses.'
  },
  // Accounts, Security, Friends, Billing
  {
    re: /Auth|OAuth|Login|Signup|JWT|Session|CSRF|CSP|Rate Limit|Audit/i,
    demo: 'Demo: Signup/login (magic link/OAuth) → refresh persists session → logout; rate-limit blocks brute-force; audit log entries.'
  },
  {
    re: /Friend|Invite|Presence/i,
    demo: 'Demo: User A invites B → B accepts → both see online → join friend’s session.'
  },
  {
    re: /Stripe|Billing|Checkout|Webhook|Entitlement/i,
    demo: 'Demo: Purchase via Checkout → webhook grants entitlement → cosmetic renders; Billing Portal opens and shows subscription.'
  },
  // Encounters (Space & Planetary)
  {
    re: /Encounter|Dogfight|Boarding|Stealth|Diplomacy|Skirmish|Chase|Landing|Evac/i,
    demo: 'Demo: Run space dogfight and planetary stealth/diplomacy encounters; Outcome Meter advances clocks; transitions (boarding/landing) persist seed/state; rewards and world changes apply.'
  },
  // Cultures & Leaders
  {
    re: /Culture|Leader|Faction|Diplomacy State|Reputation|Treaty/i,
    demo: 'Demo: Load culture from pack; interact with leader; reputation/treaty changes persist; persona stance updates visible in later encounters.'
  },
  // Death & Revial Options
  {
    re: /Death|Downed|Revival|Revial|Permadeath|Clone|Legacy|Injury|Scar/i,
    demo: 'Demo: Downed state shows death clock; rescue stabilizes; if death occurs, apply campaign policy (rewind/clone/permadeath); penalties applied; legacy inherits unlocks; Hardcore requires confirmation.'
  },
  // Campaign Setup (Resolution + Revial)
  {
    re: /Campaign Setup|New Campaign|Preset Setup|Creation Wizard/i,
    demo: 'Demo: Campaign setup chooses Outcome Meter vs Classic and Revial option (Standard/Story/Hardcore); settings persist and reflect in-session.'
  },
  // Health & Injuries / Skills
  {
    re: /Health|Injury|Status Effect|Medicine|Medkit|Treatment/i,
    demo: 'Demo: Health & Injuries panel shows thresholds and effects; perform Stabilize/Bandage/Splint/Medkit; effects timers reduce; logs recorded.'
  },
  {
    re: /Skill|Expertise|Repertoire|Training|Specialty/i,
    demo: 'Demo: Skills (capabilities) and Expertise (specializations) listed separately; contextual actions appear in Quick Intents; ranks/specializations modify Outcome Meter bands and reduce time-to-complete.'
  },
  // Army & Logistics
  {
    re: /Unit Template|Army|Logistics|Doctrine|Supply|Morale|Readiness/i,
    demo: 'Demo: Army unit template with equipment and doctrines; supply/morale/readiness affect bands and TTC; logistics lines reflected in encounters.'
  },
  // Ship Designer
  {
    re: /Ship|Hull|Module|Propulsion|Reactor|Shields|Sensors|Hangar|Drone|FTL|ECM|Sonar|Radar/i,
    demo: 'Demo: Design two ship templates with different modules and budgets; validate constraints; capabilities (carrier/boarding/stealth/e-war) unlock actions and modify real-time encounter outcomes.'
  },
  // Government Types
  {
    re: /Government|Policy|Stability|Diplomacy/i,
    demo: 'Demo: Switch government type; policy frames and stability/diplomacy modifiers apply to events and AI stances.'
  },
  // Win Criteria & Time Limits
  {
    re: /Win|Victory|Objective|Time Limit|Timer|Score|Wealth|Domination|Reputation|Tech|Cultural/i,
    demo: 'Demo: Configure victory conditions and an optional time limit; progress dashboard shows weighted objectives; end-of-session evaluates winner.'
  },
  // Visual Generation Options
  {
    re: /Visual|Generation|Style Profile|Avatar|Portrait|Consistency|Entitlement/i,
    demo: 'Demo: Toggle visual generation level (off/characters/worlds/everything); style profile enforces consistency; paid options gated by entitlement.'
  },
  // Lifetime Scope
  {
    re: /Lifetime|Generational|Civilization|Succession/i,
    demo: 'Demo: Switch lifetime scope to Civilization; simulation enables populations/economy/empires; succession/legacy persists across generations.'
  },
  // Scenario/Game Designer
  {
    re: /Scenario|Designer|Map Editor|Object Palette|Economy|Production|Factory|Trade Route/i,
    demo: 'Demo: Build a scenario with factions, cities, factories, and trade routes; run tick simulation; validate invariants; snapshot/export and playtest.'
  },
  // Dashboards & Telemetry
  {
    re: /Victory|Objective Panel|Timer/i,
    demo: 'Demo: Victory dashboard shows weighted objectives; timer accurate; accessible labels and keyboard navigation.'
  },
  {
    re: /Leaderboard|Global Users|Campaign Board/i,
    demo: 'Demo: Leaderboards update (campaign alliances/individuals) after events; global board refreshes rollups; filters work; opt-out hides user.'
  },
  {
    re: /Consent|Entitlement|Paid|Visuals|Sim Worlds/i,
    demo: 'Demo: Visuals/Sim Worlds toggles respect consent/entitlements; gating enforced; per-player/type opt-outs honored.'
  },
  // Alien Compendium
  {
    re: /Alien|Species|Morphology|Physiology|Compendium/i,
    demo: 'Demo: Alien compendium lists non-humanoid species with portraits; recurring entities remain visually consistent via style profile + seed reuse.'
  }
];

function loadTasks() {
  const raw = fs.readFileSync(TASKS_PATH, 'utf8');
  return JSON.parse(raw);
}

function saveTasks(json) {
  const out = JSON.stringify(json, null, 2);
  fs.writeFileSync(TASKS_PATH, out, 'utf8');
}

function maybeAppendDemo(fieldValue, demoLine) {
  if (!fieldValue || typeof fieldValue !== 'string') return demoLine;
  if (fieldValue.includes('Demo:')) return fieldValue; // assume already integrated
  const sep = fieldValue.endsWith('\n') ? '' : '\n';
  return fieldValue + sep + demoLine;
}

function applyDemos(task) {
  if (task && typeof task.title === 'string') {
    for (const { re, demo } of patterns) {
      if (re.test(task.title)) {
        // Prefer appending to testStrategy; fallback to details
        if (typeof task.testStrategy === 'string') {
          task.testStrategy = maybeAppendDemo(task.testStrategy, demo);
        } else if (typeof task.details === 'string') {
          task.details = maybeAppendDemo(task.details, demo);
        } else {
          task.details = demo;
        }
        break;
      }
    }
  }
  if (Array.isArray(task?.subtasks)) {
    task.subtasks.forEach(applyDemos);
  }
}

function main() {
  const json = loadTasks();
  if (!Array.isArray(json?.tasks ?? json)) {
    // Supports either top-level array or { tasks: [...] }
    const arr = json.tasks || [];
    arr.forEach(applyDemos);
  } else {
    (json.tasks || json).forEach(applyDemos);
  }
  saveTasks(json);
  console.log('Updated demo lines for matching tasks.');
}

main();


