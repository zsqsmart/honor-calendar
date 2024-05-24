<script setup lang="ts">
import type { HolidayItem } from '@hc/app/boot/holiday';
import { getHoliday } from '@hc/app/utils/holiday';
import {
  addDays,
  endOfMonth,
  getDate,
  getDay,
  getDaysInMonth,
  getWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import { last } from 'lodash-es';
import lunisolar from 'lunisolar';
import type { PropType } from 'vue';
import { computed } from 'vue';

import { CalendarShapeStatusEnum } from './typings';

enum WorkStatusEnum {
  EMPTY = '',
  REST = '休',
  WOKR = '班',
}

interface DayOption {
  // 公历
  gregorian: Date;
  // 农历
  lunar: lunisolar.Lunisolar;
  // 国定假日
  holiday: HolidayItem | null;
  // 工作状态 > 空: 正常上下班, 休: 国定假日休息, 班: 国定假日补班
  workStatus: WorkStatusEnum;
  // 是否是今天
  isToday: boolean;
  // 是否被选中
  isSelected: boolean;
  // 是否在本月
  isInThisMonth: boolean;
  // TODO: 增加国内节日(七夕/建军建党...) 增加国际节日(母亲节/青年节...)
}

const props = defineProps({
  value: {
    type: Date,
    default: () => new Date(),
  },
  shapeStatus: {
    type: String as PropType<CalendarShapeStatusEnum>,
  },
  movingDirection: {
    type: String,
    default: '',
  },
});

const isExpaned = computed(() => {
  return props.shapeStatus === CalendarShapeStatusEnum.EXPANED;
});

const groupDateOptions = (dateOptions: DayOption[]) => {
  return dateOptions.reduce((memo, cur, index) => {
    if (index % 7 === 0) {
      memo.push([cur]);
    } else {
      last(memo)?.push(cur);
    }
    return memo;
  }, [] as DayOption[][]);
};

const emit = defineEmits<{
  change: [date: Date];
}>();

const dateOptionsGroup = computed(() => {
  const curDate = props.value;
  const startDate = startOfMonth(curDate);
  const endDate = endOfMonth(curDate);
  const days = getDaysInMonth(curDate);
  //  如果是星期天, getDay 返回值为 0
  const startWeek = getDay(startDate) || 7;
  const endWeek = getDay(endDate) || 7;
  const options: DayOption[] = [];
  let prevHolidayName = '';
  for (let i = 1 - startWeek; i <= days + 6 - endWeek; i++) {
    const date = addDays(startDate, i);
    const lunar = lunisolar(date);
    const holiday = getHoliday(date);
    let workStatus = WorkStatusEnum.EMPTY;
    if (holiday) {
      workStatus = holiday.isOffDay ? WorkStatusEnum.REST : WorkStatusEnum.WOKR;
    }
    options.push({
      lunar,
      workStatus,
      // 5月 1 2 等 holiday.name 都是 劳动节, 只展示第一个就可以
      holiday: prevHolidayName === holiday?.name ? null : holiday,
      gregorian: date,
      isToday: isSameDay(date, new Date()),
      isSelected: isSameDay(date, curDate),
      isInThisMonth: isSameMonth(date, curDate),
    });
    if (holiday) {
      prevHolidayName = holiday.name;
    }
  }
  return groupDateOptions(options);
});

const renderTitle = (option: DayOption) => {
  const { holiday, lunar } = option;

  return holiday?.name || lunar.solarTerm?.toString() || lunar.format('lD');
};
</script>

<template>
  <div class="px-1 h-full">
    <!-- 行 -->
    <div
      v-for="(dateOptions, rowIndex) in dateOptionsGroup"
      :key="dateOptions[0].gregorian.toString()"
      :class="[
        'flex pt-1 items-start border-b-1 overflow-hidden',
        isExpaned && rowIndex < dateOptionsGroup.length - 1
          ? 'border-slate-200'
          : 'border-transparent',
        {
          'sticky relative top-0 z-10': dateOptions.some(
            (option) => option.isSelected,
          ),
          'bg-slate-50': !isExpaned,
        },
      ]"
      :style="{
        height: `${100 / (dateOptionsGroup.length || 1)}%`,
      }"
    >
      <!-- 第几周 -->
      <div
        style="width: 24px; height: 28px; line-height: 28px"
        class="text-slate-300 text-center"
      >
        {{ getWeek(dateOptions[0].gregorian) }}
      </div>
      <!-- 一周的天 -->
      <div
        v-for="dateOption in dateOptions"
        :key="dateOption.gregorian.toUTCString()"
        :class="{
          'flex-1 text-center text-subtitle2 flex flex-col items-center h-full': true,
          'opacity-50': !dateOption.isInThisMonth,
        }"
        :style="{
          width: `${100 / 7}%`,
        }"
      >
        <div
          :class="[
            'day',
            {
              'day-seleted': dateOption.isSelected,
              'day-today': dateOption.isToday,
            },
          ]"
          @click="emit('change', dateOption.gregorian)"
        >
          <p class="text-lg">
            <span class="relative">
              <span class="text">{{ getDate(dateOption.gregorian) }}</span>
              <span
                :class="[
                  'status text-xss',
                  {
                    'text-blue-500 text':
                      dateOption.workStatus === WorkStatusEnum.REST,
                    'text-rose-500':
                      dateOption.workStatus === WorkStatusEnum.WOKR,
                  },
                ]"
                >{{ dateOption.workStatus }}</span
              >
            </span>
          </p>
          <p class="text text-xss truncate text-slate-500">
            {{ renderTitle(dateOption) }}
          </p>
        </div>
        <div
          :class="{
            'relative w-full flex-1 overflow-hidden transition': true,
            'opacity-0': !(
              isExpaned ||
              (props.movingDirection === 'down' &&
                props.shapeStatus === CalendarShapeStatusEnum.NORMAL)
            ),
          }"
          style="min-height: 16px"
        >
          <ul class="absolute top-0 left-.5 right-.5">
            <li
              v-for="i in 20"
              class="schedule-item text-xss rounded-full w-full truncate border border-blue-300 bg-blue-100 px-1"
              :key="i"
            >
              日程日程日程日程日程日程日程-{{ i }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.day {
  width: 46px;
  height: 46px;
  border: 1px solid transparent;
  border-radius: 50%;
  transition: all 0.2s;
}

.day-seleted {
  border-color: $primary;
}

.day-today {
  color: $primary;
  .text {
    color: $primary;
    transition: all 0.2s;
  }
}
.day-seleted.day-today {
  background-color: $primary;
  color: #ffffff;
  .text {
    color: #ffffff;
  }
}

.status {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(110%, -66%);
  font-size: 10px;
}
</style>
