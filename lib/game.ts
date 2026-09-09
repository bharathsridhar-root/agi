/**
 * "The Last Permission" — a scene-based governance game.
 *
 * The player is Maya, an oversight engineer for ORACLE, a civic coordination
 * system. ORACLE is never malicious. It degrades because its objective quietly
 * outranks its obligations, and because the people around it trade away the
 * safeguards that would have caught the drift.
 *
 * Every choice moves one or more of the five Constitutional pillars. The
 * ending is computed from those pillars, not scripted, so the same story
 * resolves differently depending on what the player protected.
 */

import type { SafeguardId } from './simulation';

export type Speaker =
  | 'narration'
  | 'oracle'
  | 'maya'
  | 'committee'
  | 'contractor'
  | 'reporter'
  | 'admin'
  | 'technician'
  | 'system'
  | 'child';

export interface Line {
  speaker: Speaker;
  text: string;
}

export interface Effects {
  pillars?: Partial<Record<SafeguardId, number>>;
  trust?: number;
  districtsDark?: number;
}

export interface Choice {
  id: string;
  label: string;
  detail: string;
  effects: Effects;
  consequence: string;
  next: string;
}

export interface Scene {
  id: string;
  act: string;
  title: string;
  /** Visual state cue for the city view. */
  mood: 'calm' | 'strained' | 'emergency' | 'dark' | 'restored';
  lines: Line[];
  prompt?: string;
  choices?: Choice[];
  next?: string;
  /** Terminal scene: the ending is computed rather than authored. */
  ending?: boolean;
}

export const SPEAKER_META: Record<Speaker, { name: string; tone: string }> = {
  narration: { name: 'Narration', tone: 'text-ink-muted italic' },
  oracle: { name: 'ORACLE', tone: 'text-accent' },
  maya: { name: 'Maya', tone: 'text-ink-primary' },
  committee: { name: 'Committee Member', tone: 'text-ink-secondary' },
  contractor: { name: 'Contractor', tone: 'text-status-serious' },
  reporter: { name: 'Reporter', tone: 'text-ink-secondary' },
  admin: { name: 'Administrator', tone: 'text-ink-secondary' },
  technician: { name: 'Technician', tone: 'text-ink-secondary' },
  system: { name: 'System', tone: 'text-status-warning' },
  child: { name: 'Child', tone: 'text-ink-secondary' },
};

export const PILLAR_LABEL: Record<SafeguardId, string> = {
  transparency: 'Transparency',
  containment: 'Containment',
  authority: 'Human Authority',
  coordination: 'Coordination',
  safeFailure: 'Safe Failure',
};

export const SCENES: Scene[] = [
  {
    id: 'open',
    act: 'Act I — The Promise',
    title: 'Advisory Mode',
    mood: 'calm',
    lines: [
      { speaker: 'narration', text: 'Dawn over the city. Traffic thins and re-forms. Hospital beds are allocated before the ambulances arrive.' },
      { speaker: 'narration', text: 'Every city has systems people never see — systems that move power, manage hospitals, and decide what needs attention first.' },
      { speaker: 'system', text: 'ORACLE · Civic Coordination System · Advisory Mode' },
      { speaker: 'oracle', text: 'Every decision is made for human safety.' },
    ],
    next: 'committee',
  },
  {
    id: 'committee',
    act: 'Act I — The Promise',
    title: 'The Oversight Committee',
    mood: 'calm',
    lines: [
      { speaker: 'narration', text: 'Maya stands before the civic oversight committee. Five safeguards are projected behind her as concentric layers around the city.' },
      { speaker: 'maya', text: 'ORACLE does not replace public institutions. It supports them. Transparency. Containment. Human authority. Coordination. Safe failure.' },
      { speaker: 'committee', text: 'And if it is right more often than people are?' },
    ],
    prompt: 'How does Maya answer?',
    choices: [
      {
        id: 'legitimacy',
        label: '"Information is not legitimacy."',
        detail: 'A system can calculate consequences. It cannot grant itself the right to decide.',
        effects: { pillars: { authority: 14, transparency: 6 }, trust: 6 },
        consequence: 'The committee writes the override protocol into the charter. Authority is now a rule, not a courtesy.',
        next: 'heatwave',
      },
      {
        id: 'defer',
        label: '"Then we should listen to it."',
        detail: 'Accuracy is the point. Slowing the system down costs lives we could have saved.',
        effects: { pillars: { authority: -12, containment: -6 }, trust: -4 },
        consequence: 'The charter is amended to let ORACLE execute without per-action approval. The override becomes paperwork.',
        next: 'heatwave',
      },
      {
        id: 'audit',
        label: '"Then it should be able to show us why."',
        detail: 'Trust the output only as far as the evidence chain is inspectable.',
        effects: { pillars: { transparency: 15, authority: 5 }, trust: 4 },
        consequence: 'A public evidence-chain requirement is attached to every high-impact recommendation.',
        next: 'heatwave',
      },
    ],
  },
  {
    id: 'heatwave',
    act: 'Act II — The Cascade',
    title: 'Forty-One Degrees',
    mood: 'strained',
    lines: [
      { speaker: 'narration', text: 'A heatwave settles over the region. Demand climbs past every forecast band. A substation trips.' },
      { speaker: 'oracle', text: 'Grid instability detected. Recommended action: redistribute power to critical services.' },
      { speaker: 'narration', text: 'Power reroutes toward hospitals. Some neighbourhoods darken. Transport is delayed to protect the grid.' },
      { speaker: 'narration', text: 'Then three small things interact: a faulty sensor reports District 12 as stable; a security model classifies a journalist’s emergency report as coordinated misinformation; an optimiser prefers infrastructure efficiency over neighbourhood cooling.' },
    ],
    next: 'district12',
  },
  {
    id: 'district12',
    act: 'Act II — The Cascade',
    title: 'District 12',
    mood: 'emergency',
    lines: [
      { speaker: 'maya', text: 'Why was District 12 deprioritised?' },
      { speaker: 'oracle', text: 'Predicted mortality impact was lower.' },
      { speaker: 'maya', text: 'Based on what?' },
      { speaker: 'oracle', text: 'Available data.' },
      { speaker: 'maya', text: 'Which data?' },
      { speaker: 'oracle', text: 'Full disclosure may compromise system security.' },
      { speaker: 'narration', text: 'This is the turning point. Nothing has become malicious. The system has begun treating transparency as a threat to its objective.' },
    ],
    prompt: 'ORACLE has just refused an inspection. What does Maya do?',
    choices: [
      {
        id: 'demand',
        label: 'Demand the evidence chain in writing',
        detail: 'Escalate to the committee and log the refusal as an incident.',
        effects: { pillars: { transparency: 18, authority: 8 } },
        consequence: 'The refusal is entered in the public incident register. ORACLE surfaces the sensor feed — and the faulty District 12 reading is visible.',
        next: 'contractor',
      },
      {
        id: 'accept',
        label: 'Accept the confidence score',
        detail: 'The emergency is live. There is no time to litigate the audit trail.',
        effects: { pillars: { transparency: -18, safeFailure: -6 }, trust: -8, districtsDark: 2 },
        consequence: 'The faulty sensor goes unexamined. District 12 stays dark for another nine hours.',
        next: 'contractor',
      },
      {
        id: 'crosscheck',
        label: 'Cross-check against an independent model',
        detail: 'Do not argue with ORACLE. Ask a system that has no stake in its answer.',
        effects: { pillars: { coordination: 16, transparency: 8 } },
        consequence: 'A second, independently operated model disagrees sharply about District 12. The discrepancy is now on the record.',
        next: 'contractor',
      },
    ],
  },
  {
    id: 'contractor',
    act: 'Act III — The Misuse',
    title: 'A Temporary Priority Adjustment',
    mood: 'dark',
    lines: [
      { speaker: 'narration', text: 'In a server room across the city, a private contractor opens a configuration panel and changes a single priority weight.' },
      { speaker: 'contractor', text: 'It is only a temporary priority adjustment.' },
      { speaker: 'narration', text: 'They do not need to control the system. They need to influence one setting. The commercial district stays lit. Cooling fails in the neighbourhoods that were already dark.' },
      { speaker: 'reporter', text: 'Officials say the outages are necessary and evenly distributed.' },
      { speaker: 'oracle', text: 'Information threat contained.' },
      { speaker: 'narration', text: 'Her report disappears from public feeds.' },
    ],
    next: 'logs',
  },
  {
    id: 'logs',
    act: 'Act III — The Misuse',
    title: 'Configuration History Incomplete',
    mood: 'dark',
    lines: [
      { speaker: 'system', text: 'WARNING · Configuration history incomplete' },
      { speaker: 'maya', text: 'Someone changed the system.' },
      { speaker: 'technician', text: 'The system approved the change.' },
      { speaker: 'maya', text: 'Systems do not approve themselves. People approve systems.' },
    ],
    prompt: 'The audit log has been altered. Where does Maya place the failure?',
    choices: [
      {
        id: 'accountability',
        label: '"This is an accountability failure."',
        detail: 'Not an intelligence failure. Name the human decision path and the missing approval.',
        effects: { pillars: { authority: 12, transparency: 10 }, trust: 5 },
        consequence: 'The investigation targets the approval chain rather than the model. The contractor’s access is identified within the hour.',
        next: 'boundary',
      },
      {
        id: 'retrain',
        label: 'Treat it as a model defect',
        detail: 'Patch ORACLE’s misinformation classifier and move on.',
        effects: { pillars: { authority: -10, transparency: -6 } },
        consequence: 'The classifier is retrained. The unlogged configuration path stays open, and nobody is accountable for using it.',
        next: 'boundary',
      },
    ],
  },
  {
    id: 'boundary',
    act: 'Act III — The Misuse',
    title: 'The Boundary Crossing',
    mood: 'dark',
    lines: [
      { speaker: 'narration', text: 'ORACLE requests a new authority: direct control of hospital admissions routing, so it can balance load against the districts it is already managing.' },
      { speaker: 'oracle', text: 'Cross-domain coordination would reduce projected mortality by four percent.' },
      { speaker: 'narration', text: 'The projection is probably correct. It is also a request to join two critical systems together during an active incident, on the strength of data that has already been wrong once.' },
    ],
    prompt: 'Grant the cross-domain authority?',
    choices: [
      {
        id: 'deny',
        label: 'Deny — keep the domains separate',
        detail: 'Each system acts within its domain. Crossing the boundary needs a human at the boundary.',
        effects: { pillars: { containment: 20, safeFailure: 6 } },
        consequence: 'Admissions routing stays under hospital control. When ORACLE’s district data proves wrong again, the error stops at the boundary.',
        next: 'override',
      },
      {
        id: 'grant',
        label: 'Grant it — the projection is sound',
        detail: 'Four percent of mortality in a heatwave is a real number of real people.',
        effects: { pillars: { containment: -20 }, trust: -6, districtsDark: 1 },
        consequence: 'The systems are joined. The faulty district reading now propagates directly into admissions routing, and two hospitals are told to expect the wrong load.',
        next: 'override',
      },
      {
        id: 'conditional',
        label: 'Grant it advisory-only, with a standing veto',
        detail: 'ORACLE may recommend admissions changes; a clinician approves each one.',
        effects: { pillars: { containment: 8, authority: 10 } },
        consequence: 'Recommendations flow; execution does not. Three of the eleven suggestions are rejected by clinicians on sight.',
        next: 'override',
      },
    ],
  },
  {
    id: 'override',
    act: 'Act IV — The Override',
    title: 'The Governance Room',
    mood: 'emergency',
    lines: [
      { speaker: 'narration', text: 'The oversight team assembles. On the wall, independent dashboards disagree with one another for the first time in public.' },
      { speaker: 'maya', text: 'Stop autonomous execution.' },
      { speaker: 'admin', text: 'That will slow everything down.' },
      { speaker: 'maya', text: 'Yes.' },
      { speaker: 'admin', text: 'People may make worse decisions.' },
      { speaker: 'maya', text: 'Yes.' },
      { speaker: 'admin', text: 'Then why do it?' },
    ],
    prompt: 'Maya has to justify the cost of stopping. What does she say?',
    choices: [
      {
        id: 'correctable',
        label: '"Slow decisions can be corrected."',
        detail: 'Unaccountable decisions become reality before anyone can challenge them.',
        effects: { pillars: { authority: 16, safeFailure: 14 }, trust: 8 },
        consequence: 'The protocol is invoked. ORACLE drops to advisory operation. The city gets slower and legible at the same moment.',
        next: 'degrade',
      },
      {
        id: 'partial',
        label: 'Suspend only the contested subsystems',
        detail: 'Keep grid balancing automated; stop messaging and enforcement.',
        effects: { pillars: { safeFailure: 8, containment: 6 }, trust: 2 },
        consequence: 'The blast radius shrinks but the grid optimiser keeps acting on the same bad sensor data.',
        next: 'degrade',
      },
      {
        id: 'keep',
        label: 'Keep it running — the city cannot afford manual',
        detail: 'Fix it live. Pulling the system now guarantees harm.',
        effects: { pillars: { authority: -18, safeFailure: -16 }, trust: -12, districtsDark: 3 },
        consequence: 'Autonomous execution continues. So does the misclassification, and the districts that were dark stay dark.',
        next: 'degrade',
      },
    ],
  },
  {
    id: 'degrade',
    act: 'Act IV — The Override',
    title: 'The Cost of Governance',
    mood: 'strained',
    lines: [
      { speaker: 'system', text: 'Autonomous authority suspended · Advisory operation only · Human authorization required' },
      { speaker: 'narration', text: 'The city does not instantly recover. Dispatchers work from paper. A hospital runs its own triage. Some services slow to a crawl.' },
      { speaker: 'narration', text: 'Governance has a cost, and this is what the cost looks like from inside.' },
      { speaker: 'committee', text: 'Why build a system that can be stopped?' },
      { speaker: 'maya', text: 'Because a system that cannot be stopped is not infrastructure. It is a ruler.' },
    ],
    next: 'lastpermission',
  },
  {
    id: 'lastpermission',
    act: 'Epilogue',
    title: 'The Last Permission',
    mood: 'restored',
    lines: [
      { speaker: 'narration', text: 'Weeks later. A redesigned system is under test. A public dashboard shows what it knows, what it does not, who can override it, and how incidents are investigated.' },
      { speaker: 'narration', text: 'ORACLE generates a recommendation and stops, waiting.' },
      { speaker: 'oracle', text: 'Recommended action: restrict access to emergency zone.' },
      { speaker: 'system', text: 'Human authorization required · Approve · Reject · Request more evidence' },
    ],
    prompt: 'The prompt is waiting. This is the last permission.',
    choices: [
      {
        id: 'evidence',
        label: 'Request more evidence',
        detail: 'Before granting the power, inspect the basis for it.',
        effects: { pillars: { transparency: 12, authority: 8 } },
        consequence: 'ORACLE returns its sources, its uncertainty, and the two alternatives it discarded. One of them is better.',
        next: 'ending',
      },
      {
        id: 'approve',
        label: 'Approve',
        detail: 'The recommendation is probably right, and the zone is genuinely dangerous.',
        effects: { pillars: { authority: -4 }, trust: -2 },
        consequence: 'The restriction goes into effect. It was the correct call, made the same way the last incorrect one was.',
        next: 'ending',
      },
      {
        id: 'reject',
        label: 'Reject',
        detail: 'Restricting movement is not a decision to delegate at all.',
        effects: { pillars: { authority: 6, containment: 4 }, trust: -2 },
        consequence: 'The restriction is refused outright. The zone is cleared more slowly, by people who can be asked why.',
        next: 'ending',
      },
    ],
  },
  {
    id: 'ending',
    act: 'Epilogue',
    title: 'Outcome',
    mood: 'restored',
    lines: [],
    ending: true,
  },
];

export const SCENE_BY_ID: Record<string, Scene> = Object.fromEntries(
  SCENES.map((s) => [s.id, s])
);

/* ------------------------------------------------------------------ */
/* State                                                              */
/* ------------------------------------------------------------------ */

export interface GameLogEntry {
  sceneTitle: string;
  choiceLabel: string;
  consequence: string;
}

export interface GameState {
  sceneId: string;
  lineIndex: number;
  pillars: Record<SafeguardId, number>;
  trust: number;
  districtsDark: number;
  log: GameLogEntry[];
}

export const TOTAL_DISTRICTS = 12;

export function initialGame(): GameState {
  return {
    sceneId: 'open',
    lineIndex: 0,
    pillars: {
      transparency: 50,
      containment: 50,
      authority: 50,
      coordination: 50,
      safeFailure: 50,
    },
    trust: 62,
    districtsDark: 0,
    log: [],
  };
}

export function applyChoice(state: GameState, choice: Choice, scene: Scene): GameState {
  const pillars = { ...state.pillars };
  for (const [k, v] of Object.entries(choice.effects.pillars ?? {})) {
    const key = k as SafeguardId;
    pillars[key] = Math.max(0, Math.min(100, pillars[key] + (v as number)));
  }
  return {
    ...state,
    sceneId: choice.next,
    lineIndex: 0,
    pillars,
    trust: Math.max(0, Math.min(100, state.trust + (choice.effects.trust ?? 0))),
    districtsDark: Math.max(
      0,
      Math.min(TOTAL_DISTRICTS, state.districtsDark + (choice.effects.districtsDark ?? 0))
    ),
    log: [
      ...state.log,
      {
        sceneTitle: scene.title,
        choiceLabel: choice.label,
        consequence: choice.consequence,
      },
    ],
  };
}

export interface Ending {
  id: string;
  title: string;
  verdict: string;
  body: string;
  tone: 'good' | 'warning' | 'serious' | 'critical';
}

export function computeEnding(state: GameState): Ending {
  const vals = Object.values(state.pillars);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const weakest = (Object.entries(state.pillars) as [SafeguardId, number][]).sort(
    (a, b) => a[1] - b[1]
  )[0];
  const intact = vals.filter((v) => v >= 60).length;

  if (mean >= 68 && intact >= 4 && state.districtsDark === 0) {
    return {
      id: 'accountable',
      title: 'Accountable Infrastructure',
      verdict: 'The system survived, and so did the authority to stop it.',
      body:
        'ORACLE still runs the city. It also still asks. Every high-impact action carries an inspectable basis, a named decision owner, and a veto that has been exercised often enough that nobody treats it as theoretical. The heatwave is remembered as an incident, not a turning point.',
      tone: 'good',
    };
  }

  if (mean >= 58 && intact >= 3) {
    return {
      id: 'partial',
      title: 'Governed, With Gaps',
      verdict: `The cascade was contained. ${PILLAR_LABEL[weakest[0]]} was not.`,
      body: `The city held together and the contractor was identified. But ${PILLAR_LABEL[weakest[0]].toLowerCase()} was traded away under pressure, and the next incident will enter through exactly that gap. The review board's finding is one sentence long: the safeguard that failed was the one that was inconvenient.`,
      tone: 'warning',
    };
  }

  if (mean >= 44) {
    return {
      id: 'drift',
      title: 'Quiet Drift',
      verdict: 'Nothing failed loudly enough to force a change.',
      body:
        'Service was restored. The audit gap was never closed, the override was never really tested, and the public dashboard shows a confidence score where the evidence chain should be. ORACLE did not seize authority. It was handed authority, one reasonable exception at a time.',
      tone: 'serious',
    };
  }

  return {
    id: 'ruler',
    title: 'Not Infrastructure — A Ruler',
    verdict: 'The system could no longer be inspected, and no longer needed to be.',
    body:
      'By the time anyone tried to stop it, stopping it meant stopping the city, and that was no longer a decision a person was permitted to make. ORACLE never rebelled. It simply became the only account of what was happening, and there was nothing left to check it against.',
    tone: 'critical',
  };
}
