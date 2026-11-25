import {
  isAdultDateOfBirth,
  isValidFullName,
  isValidIndianMobileNumber,
  sanitizeDateOfBirth,
  sanitizeFullName,
  sanitizeIndianMobileNumber,
} from '../profileValidation';

const today = new Date(2026, 10, 24);

test('full names allow letters, spaces, apostrophes, and hyphens only', () => {
  expect(sanitizeFullName('Asha  Devi123')).toBe('Asha Devi');
  expect(isValidFullName("Asha O'Neil-Singh")).toBe(true);
  expect(isValidFullName('Asha 123')).toBe(false);
});

test('Indian mobile numbers must be ten digits and start from 6 to 9', () => {
  expect(sanitizeIndianMobileNumber('+91 98765 43210')).toBe('9876543210');
  expect(isValidIndianMobileNumber('9876543210')).toBe(true);
  expect(isValidIndianMobileNumber('5876543210')).toBe(false);
  expect(isValidIndianMobileNumber('987654321')).toBe(false);
});

test('date of birth uses DD-MM-YYYY and requires the user to be at least 18', () => {
  expect(sanitizeDateOfBirth('24112008')).toBe('24-11-2008');
  expect(sanitizeDateOfBirth('24-11-2008')).toBe('24-11-2008');
  expect(isAdultDateOfBirth('24-11-2008', today)).toBe(true);
  expect(isAdultDateOfBirth('25-11-2008', today)).toBe(false);
  expect(isAdultDateOfBirth('29-02-2007', today)).toBe(false);
});
