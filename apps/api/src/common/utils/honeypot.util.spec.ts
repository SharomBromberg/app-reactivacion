import { isHoneypotFilled } from './honeypot.util';

describe('isHoneypotFilled', () => {
  it('no marca como spam cuando el campo llega vacío o ausente', () => {
    expect(isHoneypotFilled(undefined)).toBe(false);
    expect(isHoneypotFilled(null)).toBe(false);
    expect(isHoneypotFilled('')).toBe(false);
    expect(isHoneypotFilled('   ')).toBe(false);
  });

  it('marca como spam un string no vacío', () => {
    expect(isHoneypotFilled('http://spam.example.com')).toBe(true);
  });

  it('marca como spam valores no-string (bypass del honeypot)', () => {
    expect(isHoneypotFilled(0)).toBe(true);
    expect(isHoneypotFilled(1)).toBe(true);
    expect(isHoneypotFilled(false)).toBe(true);
    expect(isHoneypotFilled(true)).toBe(true);
    expect(isHoneypotFilled({})).toBe(true);
    expect(isHoneypotFilled([])).toBe(true);
  });
});
