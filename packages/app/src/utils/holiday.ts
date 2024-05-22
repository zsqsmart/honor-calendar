import { format } from 'date-fns';

import { getHolidaysDic } from '../boot/holiday';

export const getHoliday = (day: Date | number | string) => {
  const dateStr = format(day, 'yyyy-MM-dd');
  const dic = getHolidaysDic();

  return dic[dateStr];
};
