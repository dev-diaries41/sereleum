export function copyTextToClipboard(text: string | null) {
  if(!text)return
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      return;
    }
  
    navigator.clipboard.writeText(text).then(() => {
    }).catch((error) => {
      console.error('Error copying text to clipboard:', error);
    });
  }


  export const shouldHide = (pathname: string, hidePaths: string[]) => hidePaths.some(pathToHide => pathname.includes(pathToHide))
  export const shouldShow = (pathname: string, showPaths: string[]) => showPaths.some(path => pathname.includes(path))

  export function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  

export function convertToNumber(value: string | number, defaultValue: number): number {
  if (typeof value === 'number') {
    return value;
  }

  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    return defaultValue;
  }

  return parsedValue;
}
export function parseNumber(value: string): number | undefined {
  const parsed = Number(value)
  return isNaN(parsed)? undefined : parsed
}


export function getCurrentMonth() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthIndex = new Date(Date.now()).getUTCMonth();
  return monthNames[currentMonthIndex];
}

export function camelCaseToWords(input: string,capitalizeFirst = false): string {
  if (!input) return input;

  const result = input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");

  if (!capitalizeFirst) return result;

  return result.charAt(0).toUpperCase() + result.slice(1);
}

import { z } from "zod";

/**
 * Converts snake_case JSON to camelCase while preserving typing.
 * Optionally validates the shape using a zod schema.
 */
function toCamelCaseKey(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function snakeToCamelRecursive(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamelRecursive);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [toCamelCaseKey(k), snakeToCamelRecursive(v)])
    );
  }
  return obj;
}

/**
 * Converts snake_case JSON to camelCase and optionally validates with zod
 */
export function convertSnakeToCamel<T>(
  data: unknown,
  schema?: z.ZodType<T>
): T {
  const camelCased = snakeToCamelRecursive(data);

  if (schema) {
    return schema.parse(camelCased);
  }

  return camelCased as T;
}
