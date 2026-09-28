import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
const source = readFileSync(new URL('../lib/plan.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { PLAN, spendSearch, searchPrice, searchBudget, restoreWallet, validTopUp } = await import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));

test('activation includes three searches; only the fourth consumes the prepaid balance', () => {
  assert.equal(PLAN.activationArs, 50000);
  let wallet = { balance: 10000, spent: 0, completedSearches: 0, includedRemaining: 3 };
  for (let i = 0; i < 3; i++) {
    assert.equal(searchPrice(wallet.includedRemaining), 0);
    wallet = spendSearch(wallet);
    assert.equal(wallet.balance, 10000);
  }
  assert.deepEqual(wallet, { balance: 10000, spent: 0, completedSearches: 3, includedRemaining: 0 });
  assert.equal(searchPrice(0), 10000);
  assert.deepEqual(spendSearch(wallet), { balance: 0, spent: 10000, completedSearches: 4, includedRemaining: 0 });
});

test('included search works with no money; paid search requires full price', () => {
  const wallet = { balance: 0, spent: 0, completedSearches: 0, includedRemaining: 1 };
  assert.equal(spendSearch(wallet).completedSearches, 1);
  const empty = { ...wallet, includedRemaining: 0 };
  assert.equal(spendSearch(empty), empty);
  const insufficient = { ...empty, balance: 9999 };
  assert.equal(spendSearch(insufficient), insufficient);
});

test('budget distinguishes included searches, purchased searches and unused pesos', () => {
  assert.deepEqual(searchBudget(0, 3), { count: 3, remainder: 0 });
  assert.deepEqual(searchBudget(30000, 0), { count: 3, remainder: 0 });
  assert.deepEqual(searchBudget(100000, 0), { count: 10, remainder: 0 });
  assert.deepEqual(searchBudget(25000, 2), { count: 4, remainder: 5000 });
  assert.equal(validTopUp(10000, 0), true);
  assert.equal(validTopUp(9999, 0), false);
  assert.equal(validTopUp(10000, 1000000), false);
});

test('recarga and reload never grant included searches again', () => {
  const wallet = { balance: 5000, spent: 20000, completedSearches: 5, includedRemaining: 0 };
  const restored = restoreWallet(JSON.parse(JSON.stringify({ ...wallet, balance: 15000 })));
  assert.equal(restored.includedRemaining, 0);
  assert.equal(spendSearch(restored).balance, 5000);
  const partiallyUsed = { ...wallet, includedRemaining: 2 };
  assert.deepEqual(restoreWallet(partiallyUsed), partiallyUsed);
});

test('legacy demo money is preserved without granting another welcome allowance', () => {
  assert.deepEqual(restoreWallet({ balance: 30000, spent: 0 }), { balance: 30000, spent: 0, completedSearches: 0, includedRemaining: 0 });
  for (const includedRemaining of [-1, 4, '3', null]) assert.equal(restoreWallet({ balance: 0, spent: 0, includedRemaining }), null);
  assert.equal(restoreWallet({ balance: -1, spent: 0 }), null);
});
