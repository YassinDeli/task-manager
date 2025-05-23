import { format, parseISO, isValid } from "date-fns";

export function toDateOnly(date: Date | string | null | undefined): string {
  // Handle string input
  if (typeof date === "string") {
    try {
      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        return format(parsedDate, "yyyy-MM-dd");
      }
    } catch {
      return ""; // Return empty string for invalid date strings
    }
  }

  // Handle Date input
  if (date instanceof Date) {
    if (isValid(date)) {
      return format(date, "yyyy-MM-dd");
    }
    return ""; // Return empty string for invalid Date objects
  }

  // Handle null/undefined
  return "";
}

export function transformDate(dateString: string | null | undefined): string {
  if (!dateString) return "";

  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "dd-MM-yyyy") : "";
  } catch {
    return "";
  }
}

export function toDateTime(date: Date | string | null | undefined): string {
  // Handle string input
  if (typeof date === "string") {
    try {
      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        return format(parsedDate, "yyyy-MM-dd HH:mm:ss");
      }
    } catch {
      return ""; // Return empty string for invalid date strings
    }
  }

  // Handle Date input
  if (date instanceof Date) {
    if (isValid(date)) {
      return format(date, "yyyy-MM-dd HH:mm:ss");
    }
    return ""; // Return empty string for invalid Date objects
  }

  // Handle null/undefined
  return "";
}

// Additional utility function that might be helpful
export function safeParseDate(
  dateString: string | null | undefined
): Date | null {
  if (!dateString) return null;

  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}
