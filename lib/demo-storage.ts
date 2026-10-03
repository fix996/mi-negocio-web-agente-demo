import { initialProfile, type Profile, type Run } from './demo-model';
import { PLAN, restoreWallet, type WalletState } from './plan';
import { validSearch, type Lead } from './prospecto';

export type DemoState = {
  profile: Profile;
  runs: Run[];
  saved: string[];
  wallet: WalletState;
};
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown, max: number): value is string =>
  typeof value === 'string' && value.length <= max;
const profileLimits = {
  name: 70,
  owner: 40,
  service: 500,
  area: 100,
  ideal: 600,
  agentName: 30,
} as const;

function restoreProfile(value: unknown): Profile {
  if (!record(value)) return { ...initialProfile };
  const result = { ...initialProfile };
  for (const key of Object.keys(profileLimits) as (keyof Profile)[]) {
    if (typeof value[key] === 'string')
      result[key] = value[key].trim().slice(0, profileLimits[key]);
  }
  for (const key of ['name', 'owner', 'service', 'area'] as const) {
    if (!result[key]) result[key] = initialProfile[key];
  }
  return result;
}

function restoreLead(value: unknown): Lead | null {
  if (
    !record(value) ||
    !text(value.id, 100) ||
    !value.id ||
    !Number.isInteger(value.score) ||
    Number(value.score) < 0 ||
    Number(value.score) > 100
  )
    return null;
  const keys = [
    'name',
    'industry',
    'place',
    'reason',
    'signal',
    'web',
    'social',
    'offer',
  ] as const;
  if (!keys.every((key) => text(value[key], 1000))) return null;
  return Object.fromEntries(
    ['id', 'score', ...keys].map((key) => [key, value[key]]),
  ) as Lead;
}

function restoreRun(value: unknown): Run | null {
  if (!record(value)) return null;
  const spec = {
    industry: value.industry,
    place: value.place,
    count: value.count,
  };
  if (
    !validSearch(spec) ||
    !text(value.id, 80) ||
    !value.id ||
    !text(value.date, 50) ||
    Number.isNaN(Date.parse(value.date)) ||
    !Array.isArray(value.leads) ||
    value.leads.length > PLAN.maxBusinesses ||
    value.leads.length !== value.count
  )
    return null;
  const leads = value.leads.map(restoreLead);
  if (
    leads.some((lead) => lead === null) ||
    new Set(leads.map((lead) => lead!.id)).size !== leads.length
  )
    return null;
  return { id: value.id, date: value.date, ...spec, leads: leads as Lead[] };
}

/** Local demo persistence only. This is not authentication or a trusted billing ledger. */
export function restoreDemo(raw: string | null): DemoState | null {
  if (!raw || raw.length > 2_000_000) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!record(data)) return null;
    const seenRuns = new Set<string>();
    const seenLeads = new Set<string>();
    const runs = (Array.isArray(data.runs) ? data.runs : [])
      .slice(0, 30)
      .map(restoreRun)
      .filter((run): run is Run => {
        if (
          !run ||
          seenRuns.has(run.id) ||
          run.leads.some((lead) => seenLeads.has(lead.id))
        )
          return false;
        seenRuns.add(run.id);
        run.leads.forEach((lead) => seenLeads.add(lead.id));
        return true;
      });
    const saved = [
      ...new Set(
        (Array.isArray(data.saved) ? data.saved : []).filter(
          (id): id is string => typeof id === 'string' && seenLeads.has(id),
        ),
      ),
    ];
    return {
      profile: restoreProfile(data.profile),
      runs,
      saved,
      wallet: restoreWallet(data.wallet) ?? {
        balance: PLAN.demoBalance,
        spent: 0,
        completedSearches: 0,
        includedRemaining: PLAN.includedSearches,
      },
    };
  } catch {
    return null;
  }
}
