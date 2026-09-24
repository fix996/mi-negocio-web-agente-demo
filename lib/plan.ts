/** Propuesta prepaga; esta demo solo maneja saldo ficticio. */
export const PLAN = {
  searchArs: 5000,
  maxBusinesses: 25,
  recommendedBusinesses: 10,
  demoBalance: 30000,
  minTopUp: 5000,
  maxBalance: 1000000,
} as const;
export type WalletState = { balance: number; spent: number };
export const ars = (value: number) =>
  '$' + new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);
export const availableSearches = (balance: number) => Math.floor(Math.max(0, balance) / PLAN.searchArs);
export const validTopUp = (amount: number, balance: number) =>
  Number.isSafeInteger(amount) && amount >= PLAN.minTopUp && Number.isSafeInteger(balance) && balance >= 0 && amount + balance <= PLAN.maxBalance;
export function spendSearch(wallet: WalletState): WalletState {
  if (!Number.isSafeInteger(wallet.balance) || wallet.balance < PLAN.searchArs) return wallet;
  return { balance: wallet.balance - PLAN.searchArs, spent: wallet.spent + PLAN.searchArs };
}
