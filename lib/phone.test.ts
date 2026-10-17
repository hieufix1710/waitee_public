import { describe, expect, it } from 'vitest';
import { countryOptions, formatAsYouType, isValidPhone, toE164 } from './phone';

describe('countryOptions', () => {
  it('lists VN first with its dial code', () => {
    const options = countryOptions('vi');
    expect(options[0].iso).toBe('VN');
    expect(options[0].dial).toBe('+84');
  });

  it('returns a non-empty, sorted list', () => {
    const options = countryOptions('en');
    expect(options.length).toBeGreaterThan(100);
    expect(options.every((option) => option.dial.startsWith('+'))).toBe(true);
  });
});

describe('formatAsYouType', () => {
  it('formats a VN number progressively', () => {
    const formatted = formatAsYouType('VN', '912345678');
    expect(formatted).not.toBe('');
    expect(formatted).toContain(' ');
  });
});

describe('isValidPhone', () => {
  it('accepts a valid VN number', () => {
    expect(isValidPhone('VN', '912345678')).toBe(true);
  });

  it('rejects an obviously invalid number', () => {
    expect(isValidPhone('VN', '123')).toBe(false);
  });
});

describe('toE164', () => {
  it('normalizes a valid VN number', () => {
    expect(toE164('VN', '912345678')).toBe('+84912345678');
  });

  it('falls back to the raw value when unparseable', () => {
    expect(toE164('VN', '')).toBe('');
  });
});
