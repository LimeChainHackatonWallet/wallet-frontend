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

/**
 * Format currency values for display
 * @param amount Number to format as currency
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Validates if a string is a valid Solana address
 * @param address String to validate as a Solana address
 * @returns Boolean indicating if the address is valid
 */
export function isValidSolanaAddress(address: string): boolean {
  // Basic validation: Solana addresses are 44 characters long
  // and are base58 encoded (only contain alphanumeric characters
  // except for 0, O, I, and l)
  if (!address || typeof address !== "string") {
    return false;
  }

  // Check length
  if (address.length !== 44) {
    return false;
  }

  // Check for valid base58 characters
  const base58Regex = /^[A-HJ-NP-Za-km-z1-9]+$/;
  return base58Regex.test(address);
}

/**
 * Converts a Uint8Array to a hexadecimal string
 * @param bytes The Uint8Array to convert
 * @returns The hexadecimal string representation of the Uint8Array
 */
export function uint8ArrayToHexString(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0")) // Ensure 2-digit hex
    .join("");
}
