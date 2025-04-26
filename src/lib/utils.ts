import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a blockchain address to a shorter version
 * @param address The full address to format
 * @param startChars Number of characters to keep at the start
 * @param endChars Number of characters to keep at the end
 * @returns Formatted address string with characters removed from the middle
 */
export function formatAddress(
  address: string,
  startChars: number = 4,
  endChars: number = 7
): string {
  if (!address) return "";

  if (address.length <= startChars + endChars) {
    return address;
  }

  const start = address.substring(0, startChars);
  const end = address.substring(address.length - endChars);

  return `${start}....${end}`;
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};
