
export function formatDateTimeUk(dateTime: string): string {
  const currentDate = new Date();
  const inputDate = new Date(dateTime);
  const timeDifferenceInSeconds = Math.floor((currentDate.getTime() - inputDate.getTime()) / 1000);

  const roundToNearestMultiple = (value: number, multiple: number): number => {
    return Math.floor(value / multiple) * multiple;
  };

  if (timeDifferenceInSeconds < 60) {
    // Less than a minute
    return '1 секунду тому';
  }

  const timeInMinutes = timeDifferenceInSeconds / 60;

  if (timeInMinutes >= 1 && timeInMinutes <= 2) {
    // A minute or two
    return '1 хвилину тому';
  }

  if (timeInMinutes < 60) {
    // Less than an hour
    const minutesAgo = roundToNearestMultiple(Math.floor(timeInMinutes), 5);

    return `${minutesAgo} хвилин тому`;
  }

  const timeInHours = timeInMinutes / 60;

  if (timeInHours >= 1 && timeInHours <= 2) {
    // An hour or two
    return '1 година тому';
  }

  if (timeInHours < 24) {
    // Less than a day
    const hoursAgo = roundToNearestMultiple(Math.floor(timeInHours), 5);

    return `${hoursAgo} годин тому`;
  }

  const timeInDays = timeInMinutes / 24;

  if (timeInDays >= 1 && timeInDays <= 2) {
    // A day or two
    return '1 день тому';
  }

  if (timeInDays < 30) {
    // Less than a month (30 days)
    const daysAgo = roundToNearestMultiple(Math.floor(timeInDays), 5);

    return `${daysAgo} днів тому`;
  }

  const timeInMonths = timeInDays / 30;

  if (timeInMonths >= 1 && timeInMonths <= 2) {
    // A months or two
    return '1 місяць тому';
  }

  if (timeInMonths < 12) {
    // Less than a year
    const monthsAgo = roundToNearestMultiple(Math.floor(timeInMonths), 5);

    return `${monthsAgo} місяців тому`;
  }

  const timeInYears = timeInMonths / 12;

  if (timeInYears >= 1 && timeInYears <= 2) {
    // A year or two
    return '1 рік тому';
  }

  // Over a year
  const yearsAgo = roundToNearestMultiple(Math.floor(timeInYears), 5);

  return `${yearsAgo} років тому`;
}

function convertTimeToString(date: number, singleForm: string, pluralForm: string): string {
  const roundToNearestMultiple = (value: number, multiple: number): number => {
    return Math.floor(value / multiple) * multiple;
  };

  if (date >= 1 && date <= 2) {
    return `1 ${singleForm} тому`;
  }

  const timeAgo = roundToNearestMultiple(Math.floor(date), 5);

  return `${timeAgo} ${pluralForm} тому`;

}
