export function formatDateTimeUk(dateTime: string): string {
  const currentDate = new Date();
  const previousDate = new Date(dateTime);
  const timeDifference = currentDate.getTime() - previousDate.getTime();

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);

    return `${seconds} секунд${seconds !== 1 ? '' : 'а'} тому`;
  }

  if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);

    return `${minutes} хвилин${minutes !== 1 ? '' : 'а'} тому`;
  }

  if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);

    return `${hours} годин${hours !== 1 ? '' : 'а'} тому`;
  }

  if (timeDifference < month) {
    const days = Math.floor(timeDifference / day);

    return `${days} днів тому`;
  }

  if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);

    return `${months} місяців тому`;
  }
  const years = Math.floor(timeDifference / year);

  return `${years} років тому`;
}
