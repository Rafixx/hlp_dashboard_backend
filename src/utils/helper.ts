
export const parseDate = (value?: string): Date | undefined => {
  return value ? new Date(value) : undefined;
};

/**
 * Valida si un string tiene formato YYYY-MM-DD
 */
export function isValidISODate(dateStr?: string): boolean {
  if (!dateStr) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * Formatea un objeto Date a string YYYY-MM-DD
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
