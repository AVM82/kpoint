import { formatDateTimeUk } from './function-format-date-time-uk';

describe('formatDateTimeUk', () => {
  test('returns correct string for less than a minute', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setSeconds(currentDate.getSeconds() - 30);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('1 секунду тому');
  });
  // MINUTES
  test('returns correct string for one minute', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMinutes(currentDate.getMinutes() - 1);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('1 хвилину тому');
  });

  test('returns correct string for two - four minutes', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMinutes(currentDate.getMinutes() - 3);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('3 хвилини тому');
  });

  test('returns correct string for 11 minutes', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMinutes(currentDate.getMinutes() - 11);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('11 хвилин тому');
  });

  test('returns correct string for 12 minutes', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMinutes(currentDate.getMinutes() - 12);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('12 хвилин тому');
  });

  test('returns correct string for 21 minutes', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMinutes(currentDate.getMinutes() - 21);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('21 хвилину тому');
  });

  test('returns correct string for 22 minutes', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMinutes(currentDate.getMinutes() - 22);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('22 хвилини тому');
  });

  test('returns correct string for 33 minutes', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMinutes(currentDate.getMinutes() - 33);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('33 хвилини тому');
  });

  test('returns correct string for 38 minutes', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMinutes(currentDate.getMinutes() - 38);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('38 хвилин тому');
  });

  // HOURS
  test('returns correct string for one hour', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setHours(currentDate.getHours() - 1);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('1 година тому');
  });

  test('returns correct string for two - four hours', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setHours(currentDate.getHours() - 2);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('2 години тому');
  });

  test('returns correct string for 22 hours', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setHours(currentDate.getHours() - 22);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('22 години тому');
  });

  test('returns correct string for 11 hours', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setHours(currentDate.getHours() - 11);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('11 годин тому');
  });

  test('returns correct string for 25 hours', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setHours(currentDate.getHours() - 23);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('23 години тому');
  });

  // DAYS
  test('returns correct string for one day', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setDate(currentDate.getDate() - 1);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('1 день тому');
  });

  test('returns correct string for two - four days', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setDate(currentDate.getDate() - 4);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('4 дні тому');
  });

  test('returns correct string for 11 days', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setDate(currentDate.getDate() - 11);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('11 днів тому');
  });

  test('returns correct string for 21 days', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setDate(currentDate.getDate() - 21);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('21 день тому');
  });

  test('returns correct string for less than a months', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setDate(currentDate.getDate() - 22);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('22 дні тому');
  });

  test('returns correct string for 25 days', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setDate(currentDate.getDate() - 25);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('25 днів тому');
  });

  // MONTHS
  test('returns correct string for 1 months', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMonth(currentDate.getMonth() - 1);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('1 місяць тому');
  });

  test('returns correct string for more than a 30 days', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMonth(currentDate.getMonth() - 3);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('3 місяці тому');
  });

  test('returns correct string for less than a year', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMonth(currentDate.getMonth() - 6);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('6 місяців тому');
  });
  test('returns correct string for more than a 11 days', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setMonth(currentDate.getMonth() - 11);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('11 місяців тому');
  });

  test('returns correct string for a year', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setFullYear(currentDate.getFullYear() - 1);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('1 рік тому');
  });

  test('returns correct string for two or four years', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setFullYear(currentDate.getFullYear() - 3);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('3 роки тому');
  });

  test('returns correct string for more than four years', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setFullYear(currentDate.getFullYear() - 5);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('5 років тому');
  });

  test('returns correct string for 11 years', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setFullYear(currentDate.getFullYear() - 11);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('11 років тому');
  });

  test('returns correct string for 21 years', () => {
    const currentDate = new Date();
    const inputDate = new Date(currentDate);
    inputDate.setFullYear(currentDate.getFullYear() - 21);
    const result = formatDateTimeUk(inputDate.toISOString());
    expect(result).toBe('21 рік тому');
  });
});
