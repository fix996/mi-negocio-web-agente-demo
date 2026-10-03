import assert from 'node:assert/strict';
import { test } from 'node:test';
import { moduleUrl } from './load-module.mjs';
const { restoreDemo } = await import(
  moduleUrl(new URL('../lib/demo-storage.ts', import.meta.url))
);
const { createLeads, validSearch, demoContact } = await import(
  moduleUrl(new URL('../lib/prospecto.ts', import.meta.url))
);
const { parseSearch } = await import(
  moduleUrl(new URL('../lib/search-query.ts', import.meta.url))
);
const spec = { industry: 'Inmobiliarias', place: 'Córdoba', count: 10 };
const run = {
  ...spec,
  id: 'run-1',
  date: '2026-10-02T12:00:00Z',
  leads: createLeads(spec, 'run-1'),
};
const wallet = {
  balance: 30000,
  spent: 10000,
  completedSearches: 4,
  includedRemaining: 0,
};

test('natural search supports accented Spanish, location and explicit quantity', () => {
  assert.deepEqual(parseSearch('Encontrá 10 inmobiliarias en Córdoba.', 5), {
    ...spec,
    industry: 'inmobiliarias',
  });
  assert.deepEqual(parseSearch('restaurantes en Villa Carlos Paz', 10), {
    industry: 'restaurantes',
    place: 'Villa Carlos Paz',
    count: 10,
  });
  for (const input of [
    '26 hoteles en Salta',
    '0 hoteles en Salta',
    'quiero contactos',
    'x'.repeat(301),
  ])
    assert.equal(parseSearch(input, 10), null);
});
test('invalid or corrupted local storage cannot crash restoration', () => {
  for (const raw of [null, '', '{', 'null', '42', '[]'])
    assert.equal(restoreDemo(raw), null);
  const result = restoreDemo(
    JSON.stringify({
      runs: [null, 4, {}, { ...run, date: 'invalid' }],
      saved: [null],
      profile: null,
    }),
  );
  assert.deepEqual(result.runs, []);
  assert.deepEqual(result.saved, []);
  assert.equal(result.profile.name, 'Tu agencia');
});
test('valid profile, search, bookmarks and spent welcome allowance survive reload', () => {
  const result = restoreDemo(
    JSON.stringify({
      profile: { name: 'Agencia Norte', owner: 'Lautaro', agentName: 'Milo' },
      runs: [run],
      wallet,
      saved: [run.leads[0].id],
    }),
  );
  assert.equal(result.profile.agentName, 'Milo');
  assert.deepEqual(result.runs, [run]);
  assert.deepEqual(result.wallet, wallet);
  assert.deepEqual(result.saved, [run.leads[0].id]);
});
test('partial leads, duplicate runs and orphaned bookmarks are discarded', () => {
  const badRun = {
    ...run,
    id: 'invalid',
    leads: [
      { id: 'broken', name: 'Incomplete', reason: 'Missing detail fields' },
    ],
  };
  const result = restoreDemo(
    JSON.stringify({
      runs: [run, run, badRun],
      saved: [run.leads[0].id, run.leads[0].id, 'orphan'],
    }),
  );
  assert.equal(result.runs.length, 1);
  assert.deepEqual(result.saved, [run.leads[0].id]);
});
test('all lead detail fields and scores are validated before rendering', () => {
  for (const replacement of [
    { web: null },
    { score: 200 },
    { offer: 42 },
    { id: '' },
  ]) {
    const leads = run.leads.map((lead, i) =>
      i === 0 ? { ...lead, ...replacement } : lead,
    );
    assert.equal(
      restoreDemo(JSON.stringify({ runs: [{ ...run, leads }] })).runs.length,
      0,
    );
  }
});
test('profile accepts only known bounded fields and keeps text as text', () => {
  const result = restoreDemo(
    JSON.stringify({
      profile: {
        name: 'x'.repeat(200),
        owner: '  ',
        agentName: '<img src=x>',
        unknown: 'discard',
      },
    }),
  );
  assert.equal(result.profile.name.length, 70);
  assert.equal(result.profile.owner, 'equipo');
  assert.equal(result.profile.agentName, '<img src=x>');
  assert.equal('unknown' in result.profile, false);
});
test('demo contacts remain reserved examples and search limits reject malformed data', () => {
  for (const lead of createLeads({ ...spec, count: 25 }, 'max'))
    assert.match(demoContact(lead), /^contacto@[a-z0-9-]+\.example$/);
  for (const value of [
    null,
    {},
    { ...spec, count: 26 },
    { ...spec, count: 1.5 },
    { ...spec, place: '' },
  ])
    assert.equal(validSearch(value), false);
  assert.equal(validSearch({ ...spec, count: 25 }), true);
});
