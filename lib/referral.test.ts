import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { REF_STORAGE_KEY, captureRefFromUrl, clearStoredRef, getStoredRef } from './referral';

function createWindowStub() {
  const store = new Map<string, string>();
  const location = { search: '' };

  return {
    location,
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
      removeItem: (key: string) => void store.delete(key),
      clear: () => store.clear(),
    },
  };
}

describe('referral', () => {
  let win: ReturnType<typeof createWindowStub>;

  beforeAll(() => {
    win = createWindowStub();
    (globalThis as unknown as { window: unknown }).window = win;
  });

  afterAll(() => {
    delete (globalThis as unknown as { window?: unknown }).window;
  });

  beforeEach(() => {
    win.localStorage.clear();
    win.location.search = '';
  });

  it('captures a ref code from the URL and persists it', () => {
    win.location.search = '?ref=abc123';
    expect(captureRefFromUrl()).toBe('abc123');
    expect(win.localStorage.getItem(REF_STORAGE_KEY)).toBe('abc123');
  });

  it('is first-touch: never overwrites an existing code', () => {
    win.localStorage.setItem(REF_STORAGE_KEY, 'first');
    win.location.search = '?ref=second';
    expect(captureRefFromUrl()).toBe('first');
    expect(win.localStorage.getItem(REF_STORAGE_KEY)).toBe('first');
  });

  it('returns null when there is no ref', () => {
    win.location.search = '';
    expect(captureRefFromUrl()).toBeNull();
  });

  it('reads the stored code and treats blanks as absent', () => {
    expect(getStoredRef()).toBeNull();
    win.localStorage.setItem(REF_STORAGE_KEY, '   ');
    expect(getStoredRef()).toBeNull();
    win.localStorage.setItem(REF_STORAGE_KEY, 'xyz');
    expect(getStoredRef()).toBe('xyz');
  });

  it('clears the stored code', () => {
    win.localStorage.setItem(REF_STORAGE_KEY, 'xyz');
    clearStoredRef();
    expect(getStoredRef()).toBeNull();
  });
});
