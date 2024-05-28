import { ScheduleModel } from '../typings/schedule';
import LocalCache from './local-cache';

class ScheduleDB {
  static get allSchedulesMap(): Map<string, ScheduleModel> {
    return LocalCache.getItem(LocalCache.keys.schedule) || new Map();
  }

  static getItemByTime(time: Date) {
    const result: ScheduleModel[] = [];
    for (const [, schedule] of ScheduleDB.allSchedulesMap) {
      const ms = time.getTime();
      if (
        ms >= new Date(schedule.startTime).getTime() &&
        ms <= new Date(schedule.endTime).getTime()
      ) {
        result.push(schedule);
      }
    }
    return result;
  }

  static addSchedule(schedule: ScheduleModel) {
    const allSchedulesMap = ScheduleDB.allSchedulesMap;
    allSchedulesMap.set(schedule.id, schedule);
    LocalCache.setItem(LocalCache.keys.schedule, allSchedulesMap);
  }

  static removeSchedule(id: string) {
    const allSchedulesMap = ScheduleDB.allSchedulesMap;
    allSchedulesMap.delete(id);
    LocalCache.setItem(LocalCache.keys.schedule, allSchedulesMap);
  }
}

export default ScheduleDB;
