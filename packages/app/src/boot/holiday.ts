// https://github.com/NateScarlet/holiday-cn
import { keyBy } from 'lodash-es';

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

export const getHolidaysDic = () => dic;

export default async () => {
  const files = import.meta.glob('../assets/holidays/*.json');

  await Promise.all(
    Object.values(files).map(async (file) => {
      const data = (await file()) as { default: Holidays };
      Object.assign(dic, keyBy(data.default.days, 'date'));
    }),
  );
};
