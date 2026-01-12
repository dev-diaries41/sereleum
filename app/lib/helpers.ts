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


  export const shouldHide = (pathname: string, pathsToHide: string[]) => pathsToHide.some(pathToHide => pathname.includes(pathToHide))

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
