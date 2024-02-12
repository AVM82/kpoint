
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

  if (timeDifferenceInSeconds < 3600) {
    // Less than an hour
    const minutesAgo = roundToNearestMultiple(Math.floor(timeDifferenceInSeconds / 60), 5);

    return `${minutesAgo} хвилин тому`;
  }

  if (timeDifferenceInSeconds < 86400) {
    // Less than a day
    const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600); // 3600 seconds in an hour

    if (hoursAgo === 1) {
      return '1 година тому';
    }

    if (hoursAgo >= 2 && hoursAgo <= 4) {
      return `${hoursAgo} години тому`;
    }

    return `${hoursAgo} годин тому`;

  }

  if (timeDifferenceInSeconds < 2592000) {
    // Less than a month (30 days)
    const daysAgo = roundToNearestMultiple(Math.floor(timeDifferenceInSeconds / 86400), 5);

    return `${daysAgo} днів тому`;
  }

  if (timeDifferenceInSeconds < 31536000) {
    // Less than a year
    const monthsAgo = roundToNearestMultiple(Math.floor(timeDifferenceInSeconds / 2592000), 5);

    return `${monthsAgo} місяців тому`;
  }
  // Over a year
  const yearsAgo = roundToNearestMultiple(Math.floor(timeDifferenceInSeconds / 31536000), 5);

  return `${yearsAgo} років тому`;

}
