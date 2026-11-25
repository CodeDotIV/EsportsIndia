export const sanitizeFullName = (value) =>
  String(value || '')
    .replace(/[^\p{L}\p{M}\s'-]/gu, '')
    .replace(/\s+/g, ' ');

export const isValidFullName = (value) =>
  /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u.test(String(value || '').trim());

export const sanitizeIndianMobileNumber = (value) => {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  return digits.slice(0, 10);
};

export const isValidIndianMobileNumber = (value) => /^[6-9]\d{9}$/.test(String(value || ''));

export const sanitizeDateOfBirth = (value) => {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
};

export const isAdultDateOfBirth = (value, today = new Date()) => {
  const dateOfBirth = String(value || '');
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth)) return false;

  const [dayValue, monthValue, yearValue] = dateOfBirth.split('-');
  const day = Number(dayValue);
  const month = Number(monthValue);
  const year = Number(yearValue);
  if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return false;

  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return false;
  }

  let age = today.getFullYear() - year;
  const birthdayHasNotOccurred =
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day);
  if (birthdayHasNotOccurred) age -= 1;

  return age >= 18;
};
