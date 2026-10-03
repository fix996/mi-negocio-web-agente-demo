/** Propuesta comercial. La demo solo usa búsquedas y saldo ficticios. */
export const PLAN = {
  activationArs: 50000,
  includedSearches: 3,
  searchArs: 10000,
  maxBusinesses: 25,
  recommendedBusinesses: 10,
  demoBalance: 0,
  minTopUp: 10000,
  maxBalance: 1000000,
} as const;
export type WalletState = {
  balance: number;
  spent: number;
  completedSearches: number;
  includedRemaining: number;
};
export const ars = (value: number) =>
  '$' +
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);
export const searchPrice = (includedRemaining: number) =>
  includedRemaining > 0 ? 0 : PLAN.searchArs;
export function searchBudget(balance: number, includedRemaining = 0) {
  const funds = Math.max(0, balance);
  return {
    count: includedRemaining + Math.floor(funds / PLAN.searchArs),
    remainder: funds % PLAN.searchArs,
  };
}
export const availableSearches = (balance: number, includedRemaining = 0) =>
  searchBudget(balance, includedRemaining).count;
export const validTopUp = (amount: number, balance: number) =>
  Number.isSafeInteger(amount) &&
  amount >= PLAN.minTopUp &&
  Number.isSafeInteger(balance) &&
  balance >= 0 &&
  amount + balance <= PLAN.maxBalance;
export function spendSearch(wallet: WalletState): WalletState {
  const price = searchPrice(wallet.includedRemaining);
  if (!Number.isSafeInteger(wallet.balance) || wallet.balance < price)
    return wallet;
  return {
    ...wallet,
    balance: wallet.balance - price,
    spent: wallet.spent + price,
    completedSearches: wallet.completedSearches + 1,
    includedRemaining: Math.max(0, wallet.includedRemaining - 1),
  };
}
export function restoreWallet(value: unknown): WalletState | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Partial<WalletState>;
  if (
    !Number.isSafeInteger(v.balance) ||
    v.balance! < 0 ||
    v.balance! > PLAN.maxBalance ||
    !Number.isSafeInteger(v.spent) ||
    v.spent! < 0
  )
    return null;
  const completedSearches = v.completedSearches ?? 0;
  // Older demos already received money: preserve it without granting the included searches again.
  const includedRemaining =
    v.includedRemaining === undefined ? 0 : v.includedRemaining;
  if (
    !Number.isSafeInteger(completedSearches) ||
    completedSearches < 0 ||
    !Number.isSafeInteger(includedRemaining) ||
    includedRemaining < 0 ||
    includedRemaining > PLAN.includedSearches
  )
    return null;
  return {
    balance: v.balance!,
    spent: v.spent!,
    completedSearches,
    includedRemaining,
  };
}
