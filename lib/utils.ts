import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colClassMap: Record<number, string> = {
  1: `grid-cols-1`,
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
}

export const formatVND = (amount: number): string => {
  if (isNaN(amount)) return '';
  return amount.toLocaleString('vi-VN') + 'đ';
}

export const API_URL = 'https://beta.giatchanlangson.com/api';