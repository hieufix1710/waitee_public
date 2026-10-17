// Phone number helpers for the signup/onboarding form: country list (dial
// codes + localized names) and per-country validation/normalization backed by
// libphonenumber-js. Kept UI-free so it can be unit-tested.

import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';

export interface CountryOption {
  iso: CountryCode;
  dial: string;
  name: string;
}

/** Countries with their calling code, names localized to `lang`, VN first. */
export function countryOptions(lang: string): CountryOption[] {
  const display = (() => {
    try {
      return new Intl.DisplayNames([lang], { type: 'region' });
    } catch {
      return null;
    }
  })();

  return getCountries()
    .map((iso) => ({
      iso,
      dial: `+${getCountryCallingCode(iso)}`,
      name: display?.of(iso) ?? iso,
    }))
    .sort((a, b) => {
      if (a.iso === 'VN') return -1;
      if (b.iso === 'VN') return 1;
      return a.name.localeCompare(b.name, lang);
    });
}

/** Progressive "as you type" formatting for the given country. */
export function formatAsYouType(iso: CountryCode, value: string): string {
  return new AsYouType(iso).input(value);
}

/** True when `value` is a valid number for `iso`. */
export function isValidPhone(iso: CountryCode, value: string): boolean {
  const parsed = parsePhoneNumberFromString(value, iso);
  return Boolean(parsed?.isValid());
}

/** Normalizes to E.164 (e.g. `+84912345678`); falls back to the raw digits. */
export function toE164(iso: CountryCode, value: string): string {
  const parsed = parsePhoneNumberFromString(value, iso);
  return parsed?.number ?? value;
}
