import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/plan.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { spendSearch, searchPrice, searchBudget, restoreWallet } = await import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));

test('three introductory searches, then full price; no fourth search with insufficient funds', () => {
  let wallet = { balance: 30000, spent: 0, completedSearches: 0 };
  for (let i = 0; i < 3; i++) {
    assert.equal(searchPrice(wallet.completedSearches), 10000);
    wallet = spendSearch(wallet);
  }
  assert.deepEqual(wallet, { balance: 0, spent: 30000, completedSearches: 3 });
  assert.equal(searchPrice(wallet.completedSearches), 25000);
  assert.equal(spendSearch(wallet), wallet);
  const underfunded = { ...wallet, balance: 24999 };
  assert.equal(spendSearch(underfunded), underfunded);
  assert.deepEqual(spendSearch({ ...wallet, balance: 25000 }), { balance: 0, spent: 55000, completedSearches: 4 });
});

test('budget calculations cross the promotion boundary and retain partial balances', () => {
  assert.deepEqual(searchBudget(100000, 0), { count: 5, remainder: 20000 });
  assert.deepEqual(searchBudget(105000, 0), { count: 6, remainder: 0 });
  assert.deepEqual(searchBudget(100000, 3), { count: 4, remainder: 0 });
  assert.deepEqual(searchBudget(35000, 2), { count: 2, remainder: 0 });
  assert.deepEqual(searchBudget(9999, 0), { count: 0, remainder: 9999 });
});

test('recarga and reload preserve the promotion count independently of history', () => {
  const wallet = { balance: 5000, spent: 30000, completedSearches: 3 };
  const recharged = { ...wallet, balance: wallet.balance + 20000 };
  const restored = restoreWallet(JSON.parse(JSON.stringify(recharged)));
  assert.equal(searchPrice(restored.completedSearches), 25000);
  assert.equal(spendSearch(restored).balance, 0);
  assert.equal(searchPrice(34), 25000);
});

test('legacy demo migration keeps money; corrupt wallet values are rejected', () => {
  assert.deepEqual(restoreWallet({ balance: 15000, spent: 15000 }), { balance: 15000, spent: 15000, completedSearches: 0 });
  assert.equal(restoreWallet({ balance: 15000, spent: 0, completedSearches: -1 }), null);
  assert.equal(restoreWallet({ balance: 15000, spent: 0, completedSearches: '3' }), null);
  assert.equal(restoreWallet({ balance: -1, spent: 0 }), null);
});
