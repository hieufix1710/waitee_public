'use client';

import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';
import type { CountryCode } from 'libphonenumber-js';
import { countryOptions, formatAsYouType } from '@/lib/phone';

/**
 * Country-code selector + phone input with as-you-type formatting. The dial
 * code is shown as a fixed prefix; validation lives in `lib/phone`.
 */
export function PhoneField({
  label,
  lang,
  country,
  value,
  onCountryChange,
  onValueChange,
  error,
}: {
  label: string;
  lang: string;
  country: CountryCode;
  value: string;
  onCountryChange: (iso: CountryCode) => void;
  onValueChange: (value: string) => void;
  error?: string;
}) {
  const countries = useMemo(() => countryOptions(lang), [lang]);
  const dial = countries.find((c) => c.iso === country)?.dial ?? '';

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-zinc-900">{label}</label>
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={country}
            onChange={(e) => onCountryChange(e.target.value as CountryCode)}
            aria-label="Country"
            className="h-full appearance-none rounded-xl border border-zinc-200 bg-white py-3 pl-3 pr-7 text-sm font-medium text-zinc-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            {countries.map((c) => (
              <option key={c.iso} value={c.iso}>
                {c.iso} {c.dial}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>

        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">
            {dial}
          </span>
          <input
            value={value}
            onChange={(e) => onValueChange(formatAsYouType(country, e.target.value))}
            inputMode="tel"
            autoComplete="tel"
            placeholder="912 345 678"
            className="w-full rounded-xl border border-zinc-200 py-3 pl-14 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
