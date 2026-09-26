/** Propuesta prepaga; esta demo solo maneja saldo ficticio. */
export const PLAN = {
  searchArs: 25000,
  introSearchArs: 10000,
  introSearches: 3,
  maxBusinesses: 25,
  recommendedBusinesses: 10,
  demoBalance: 30000,
  minTopUp: 10000,
  maxBalance: 1000000,
} as const;
export type WalletState = { balance: number; spent: number; completedSearches: number };
export const ars = (value: number) =>
  '$' + new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);
export const introductorySearchesLeft = (completedSearches: number) => Math.max(0, PLAN.introSearches - completedSearches);
export const searchPrice = (completedSearches: number) => introductorySearchesLeft(completedSearches) > 0 ? PLAN.introSearchArs : PLAN.searchArs;
export function searchBudget(balance: number, completedSearches: number) {
  const funds = Math.max(0, balance);
  const intro = Math.min(introductorySearchesLeft(completedSearches), Math.floor(funds / PLAN.introSearchArs));
  const afterIntro = funds - intro * PLAN.introSearchArs;
  const standard = intro === introductorySearchesLeft(completedSearches) ? Math.floor(afterIntro / PLAN.searchArs) : 0;
  return { count: intro + standard, remainder: afterIntro - standard * PLAN.searchArs };
}
export const availableSearches = (balance: number, completedSearches: number) => searchBudget(balance, completedSearches).count;
export const validTopUp = (amount: number, balance: number) =>
  Number.isSafeInteger(amount) && amount >= PLAN.minTopUp && Number.isSafeInteger(balance) && balance >= 0 && amount + balance <= PLAN.maxBalance;
export function spendSearch(wallet: WalletState): WalletState {
  const price = searchPrice(wallet.completedSearches);
  if (!Number.isSafeInteger(wallet.balance) || wallet.balance < price) return wallet;
  return { balance: wallet.balance - price, spent: wallet.spent + price, completedSearches: wallet.completedSearches + 1 };
}

export function restoreWallet(value: unknown): WalletState | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Partial<WalletState>;
  if (!Number.isSafeInteger(v.balance) || v.balance! < 0 || v.balance! > PLAN.maxBalance || !Number.isSafeInteger(v.spent) || v.spent! < 0) return null;
  // Existing demos keep their money and begin the new introductory offer once.
  const completedSearches = v.completedSearches ?? 0;
  if (!Number.isSafeInteger(completedSearches) || completedSearches < 0) return null;
  return { balance: v.balance!, spent: v.spent!, completedSearches };
}
