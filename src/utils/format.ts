export const formatCurrency = (cents: number): string => {
  const kronor = cents / 100;
  return `${kronor.toFixed(2)} kr`;
};

export const formatCurrencyShort = (cents: number): string => {
  const kronor = Math.floor(cents / 100);
  return `${kronor} kr`;
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
