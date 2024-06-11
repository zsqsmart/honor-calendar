import { formatDate, getYear } from 'date-fns';

export const smartFormatDate = (dateInput: Date | string | number) => {
  const now = new Date();
  const date = new Date(dateInput);
  let format = 'yyyy年MM月dd日';
  if (getYear(now) === getYear(date)) {
    format = 'MM月dd日';
  }
  return formatDate(date, format);
};
