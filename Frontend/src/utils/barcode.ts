/**
 * Shared Barcode (ISO/IEC 15417 Code 128), Hardware Scanner Input Normalizer,
 * and Formatting Utilities for ELSORY STORE.
 */

export interface BarcodeBarRect {
  x: number;
  width: number;
}

/**
 * Official ISO/IEC 15417 Code 128 bar/space width patterns (values 0..106).
 * Symbols 0..105 have 6 elements (3 bars, 3 spaces) totaling 11 modules.
 * Symbol 106 (STOP) has 7 elements (4 bars, 3 spaces) totaling 13 modules.
 */
export const CODE128_PATTERNS: readonly string[] = [
  "212222",
  "222122",
  "222221",
  "121223",
  "121322",
  "131222",
  "122213",
  "122312",
  "132212",
  "221213",
  "221312",
  "231212",
  "112232",
  "122132",
  "122231",
  "113222",
  "123122",
  "123221",
  "223211",
  "221132",
  "221231",
  "213212",
  "223112",
  "312131",
  "311222",
  "321122",
  "321221",
  "312212",
  "322112",
  "322211",
  "212123",
  "212321",
  "232121",
  "111323",
  "131123",
  "131321",
  "112313",
  "132113",
  "132311",
  "211313",
  "231113",
  "231311",
  "112133",
  "112331",
  "132131",
  "113123",
  "113321",
  "133121",
  "313121",
  "211331",
  "231131",
  "213113",
  "213311",
  "213131",
  "311123",
  "311321",
  "331121",
  "312113",
  "312311",
  "332111",
  "314111",
  "221411",
  "431111",
  "111224",
  "111422",
  "121124",
  "121421",
  "141122",
  "141221",
  "112214",
  "112412",
  "122114",
  "122411",
  "142112",
  "142211",
  "241211",
  "221114",
  "413111",
  "241112",
  "134111",
  "111242",
  "121142",
  "121241",
  "114212",
  "124112",
  "124211",
  "411212",
  "421112",
  "421211",
  "212141",
  "214121",
  "412121",
  "111143",
  "111341",
  "131141",
  "114113",
  "114311",
  "411113",
  "411311",
  "113141",
  "114131",
  "311141",
  "411131",
  "211412", // 103: START A
  "211214", // 104: START B
  "211232", // 105: START C
  "2331112", // 106: STOP
];

/**
 * Encodes an ASCII/numeric string into Code 128 bar coordinates with Modulo 103 checksum
 * and 10-module left/right quiet zones for 100% compatibility with POS barcode scanners.
 */
export function encodeCode128Bars(rawValue: string): {
  bars: BarcodeBarRect[];
  totalModules: number;
} {
  const clean = rawValue.trim();
  const codes: number[] = [];

  const isEvenDigits =
    /^\d+$/.test(clean) && clean.length >= 4 && clean.length % 2 === 0;

  if (isEvenDigits) {
    codes.push(105); // START C
    for (let i = 0; i < clean.length; i += 2) {
      const pairVal = Number(clean.slice(i, i + 2));
      codes.push(pairVal);
    }
  } else {
    codes.push(104); // START B
    for (let i = 0; i < clean.length; i += 1) {
      const charCode = clean.charCodeAt(i);
      const val = charCode >= 32 && charCode <= 126 ? charCode - 32 : 0;
      codes.push(val);
    }
  }

  let checksum = codes[0] ?? 104;
  for (let i = 1; i < codes.length; i += 1) {
    checksum += (codes[i] ?? 0) * i;
  }
  codes.push(checksum % 103);
  codes.push(106); // STOP

  const quietZone = 10;
  let cursor = quietZone;
  const bars: BarcodeBarRect[] = [];

  for (const code of codes) {
    const pattern = CODE128_PATTERNS[code] ?? CODE128_PATTERNS[0];
    for (let idx = 0; idx < pattern.length; idx += 1) {
      const width = Number(pattern[idx]);
      if (idx % 2 === 0) {
        bars.push({ x: cursor, width });
      }
      cursor += width;
    }
  }

  const totalModules = cursor + quietZone;
  return { bars, totalModules };
}

/**
 * Normalizes strings coming from USB/Bluetooth HID Barcode Readers:
 * - Converts Arabic-Indic (٠-٩) & Eastern Arabic (۰-۹) digits to ASCII (0-9)
 *   in case the OS keyboard layout is set to Arabic during scanning.
 * - Strips scanner control characters (\r, \n, \t).
 */
export function normalizeBarcodeScannerInput(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\r\n\t\u200B-\u200D\uFEFF]/g, "")
    .trim();
}

export function formatCurrencyEgp(value: number): string {
  return `${Number(value || 0).toLocaleString("ar-EG")} ج.م`;
}

export function formatArabicDateTime(dateStr?: string): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  const validDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return validDate.toLocaleString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
