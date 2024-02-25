
export function formatDateTimeUk(dateTime: string): string {
  const currentDate = new Date();
  const inputDate = new Date(dateTime);
  const timeDifferenceInSeconds = Math.floor((currentDate.getTime() - inputDate.getTime()) / 1000);

  if (timeDifferenceInSeconds < 60) {
    // Less than a minute
    return '1 секунду тому';
  }

  const timeInMinutes = Math.floor(timeDifferenceInSeconds / 60);

  if (timeInMinutes < 60){
    return convertTimeToString(timeInMinutes, 'хвилину', 'хвилини', 'хвилин');
  }

  const timeInHours = Math.floor(timeInMinutes / 60);

  if (timeInHours < 24) {
    return convertTimeToString(timeInHours, 'година', 'години', 'годин');
  }

  const timeInDays = Math.floor(timeInHours / 24);

  if (timeInDays < 30) {
    return convertTimeToString(timeInDays, 'день', 'дні', 'днів');
  }

  const timeInMonths = Math.floor(timeInDays / 30);

  if (timeInMonths < 12) {
    return convertTimeToString(timeInMonths, 'місяць', 'місяці', 'місяців');
  }

  const timeInYears = Math.floor(timeInMonths / 12);

  return convertTimeToString(timeInYears, 'рік', 'роки', 'років');

}

function convertTimeToString(date: number, singleForm: string,secondForm: string, pluralForm: string): string {

  if (Number.parseInt(date.toString().charAt(date.toString().length-1)) === 1 && date !== 11) {
    return `${date} ${singleForm} тому`;
  }

  if (date < 5 || (date > 20 && Number.parseInt(date.toString().charAt(date.toString().length-1)) < 5)) {
    return `${date} ${secondForm} тому`;
  }

  return `${date} ${pluralForm} тому`;

}
