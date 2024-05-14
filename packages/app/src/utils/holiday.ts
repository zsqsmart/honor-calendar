// https://github.com/NateScarlet/holiday-cn

import { format } from 'date-fns';
import { isEmpty, keyBy } from 'lodash-es';
const files = import.meta.glob('../assets/holidays/*.json');

export interface HolidayItem {
  /** 节日名称 */
  name: string;
  /** 日期, ISO 8601 格式 */
  date: string;
  /** 是否为休息日 */
  isOffDay: boolean;
}

export interface Holidays {
  /** 完整年份, 整数。*/
  year: number;
  /** 所用国务院文件网址列表 */
  papers: string[];
  days: HolidayItem[];
}

const dic: Record<string, HolidayItem> = {};

// TODO: 放到 boot 里面
export const getHolidaysDic = async () => {
  if (!isEmpty(dic)) return dic;

  await Promise.all(
    Object.values(files).map(async (file) => {
      const data = (await file()) as { default: Holidays };
      Object.assign(dic, keyBy(data.default.days, 'date'));
    }),
  );

  return dic;
};

export const getHoliday = async (day: Date | number | string) => {
  const dateStr = format(day, 'yyyy-MM-dd');
  const dic = await getHolidaysDic();

  return dic[dateStr];
};
