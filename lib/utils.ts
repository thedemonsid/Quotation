import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convert number to words (Indian numbering: lakhs, crores, paise) */
export function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";

  const numStr = Math.floor(num).toString();
  let words = "";

  if (numStr.length > 7) {
    const crores = parseInt(numStr.slice(0, -7));
    words += numberToWords(crores) + " Crore ";
  }
  if (numStr.length > 5) {
    const lakhs = parseInt(numStr.slice(-7, -5) || "0");
    if (lakhs > 0) words += numberToWords(lakhs) + " Lakh ";
  }
  if (numStr.length > 3) {
    const thousands = parseInt(numStr.slice(-5, -3) || "0");
    if (thousands > 0) words += numberToWords(thousands) + " Thousand ";
  }

  const lastThree = parseInt(numStr.slice(-3));
  const hundreds = Math.floor(lastThree / 100);
  if (hundreds > 0) words += ones[hundreds] + " Hundred ";

  const lastTwo = lastThree % 100;
  if (lastTwo >= 10 && lastTwo < 20) {
    words += teens[lastTwo - 10] + " ";
  } else {
    const tensDigit = Math.floor(lastTwo / 10);
    const onesDigit = lastTwo % 10;
    if (tensDigit > 0) words += tens[tensDigit] + " ";
    if (onesDigit > 0) words += ones[onesDigit] + " ";
  }

  const decimal = Math.round((num % 1) * 100);
  if (decimal > 0) words += "and " + numberToWords(decimal) + " Paise";

  return words.trim();
}
