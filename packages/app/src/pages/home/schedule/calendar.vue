<script setup lang="ts">
import type { HolidayItem } from '@hc/app/utils/holiday';
import { getHoliday } from '@hc/app/utils/holiday';
import {
  addDays,
  endOfMonth,
  getDate,
  getDay,
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import lunisolar from 'lunisolar';
import { ref, watch } from 'vue';

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
});

const dateOptions = ref<DayOption[]>([]);
const emit = defineEmits<{
  change: [date: Date];
}>();

watch(
  () => props.value,
  async (curDate) => {
    const startDate = startOfMonth(curDate);
    const endDate = endOfMonth(curDate);
    const days = getDaysInMonth(curDate);
    //  如果是星期天, getDay 返回值为 0
    const startWeek = getDay(startDate) || 7;
    const endWeek = getDay(endDate);
    const options: DayOption[] = [];
    let prevHolidayName = '';
    for (let i = 1 - startWeek; i <= days + 6 - endWeek; i++) {
      const date = addDays(startDate, i);
      const lunar = lunisolar(date);
      const holiday = await getHoliday(date);
      let workStatus = WorkStatusEnum.EMPTY;
      if (holiday) {
        workStatus = holiday.isOffDay
          ? WorkStatusEnum.REST
          : WorkStatusEnum.WOKR;
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
    dateOptions.value = options;
  },
  {
    immediate: true,
  },
);

const renderTitle = (option: DayOption) => {
  const { holiday, lunar } = option;

  return holiday?.name || lunar.solarTerm?.toString() || lunar.format('lD');
};
</script>

<template>
  <div class="flex">
    <div
      v-for="dateOption in dateOptions"
      :key="dateOption.gregorian.toUTCString()"
      :class="[
        'text-center text-subtitle2 flex flex-col justify-center items-center',
        {
          'text-slate-300	': !dateOption.isInThisMonth,
        },
      ]"
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
                'status',
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
        <p
          :class="[
            'text',
            'text-xs',
            dateOption.isInThisMonth ? 'text-slate-500' : 'text-slate-300',
          ]"
        >
          {{ renderTitle(dateOption) }}
        </p>
      </div>
      <p class="schedule"></p>
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
  transform: translateX(110%);
  font-size: 10px;
}

.schedule {
  height: 20px;
}
</style>
