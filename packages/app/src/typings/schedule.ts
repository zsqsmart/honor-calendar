export interface ScheduleModel {
  id: string;
  // 标题
  title: string;
  // 位置
  location: string;
  // 是否是全天
  isAllDay: boolean;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
  // 提前多久提醒
  noticeAdvance: string;
  // 再次提醒时间间隔
  noticeInterval: number;
  // 重复提醒次数
  noticeRepeat: number;
  // 描述
  desc: string;
  // 优先级
  priority: PriorityEnum;
  // 重复
  repeat: string;
}

export enum PriorityEnum {
  IGNORE = 0,
  NORMAL = 10,
  IMPORTANT = 20,
}
