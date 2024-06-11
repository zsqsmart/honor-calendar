import { endOfDay, startOfDay } from 'date-fns';
import { mapValues } from 'lodash-es';

import { ScheduleModel } from '../typings/schedule';
import LocalCache from './local-cache';

class ScheduleDB {
  static get allSchedules(): Record<string, ScheduleModel> {
    return LocalCache.getItem(LocalCache.keys.schedule) || {};
  }

  static getSchedulesByTime(time: Date) {
    const result: ScheduleModel[] = [];
    mapValues(ScheduleDB.allSchedules, (schedule) => {
      const ms = time.getTime();
      if (
        ms >= new Date(startOfDay(schedule.startTime)).getTime() &&
        ms <= new Date(endOfDay(schedule.endTime)).getTime()
      ) {
        result.push(schedule);
      }
    });

    return result;
  }

  static addSchedule(schedule: ScheduleModel) {
    const allSchedules = ScheduleDB.allSchedules;
    allSchedules[schedule.id] = schedule;
    LocalCache.setItem(LocalCache.keys.schedule, allSchedules);
  }

  static removeSchedule(id: string) {
    const allSchedules = ScheduleDB.allSchedules;
    Reflect.deleteProperty(allSchedules, id);
    LocalCache.setItem(LocalCache.keys.schedule, allSchedules);
  }
}

export default ScheduleDB;
