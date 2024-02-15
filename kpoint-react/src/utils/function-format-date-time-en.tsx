export function formatDateTime(dateTime: string): string {
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

    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }

  if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);

    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);

    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  if (timeDifference < month) {
    const days = Math.floor(timeDifference / day);

    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);

    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(timeDifference / year);

  return `${years} year${years !== 1 ? 's' : ''} ago`;

}
