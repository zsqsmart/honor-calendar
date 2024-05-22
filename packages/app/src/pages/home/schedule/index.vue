<script setup lang="ts">
import { addMonths, differenceInDays, format, startOfMonth } from 'date-fns';
import lunisolar from 'lunisolar';
import { Screen, type TouchPanValue } from 'quasar';
import { computed, ref } from 'vue';

import Calendar from './calendar.vue';
import ScheduleItem from './item.vue';
import { CalendarShapeStatusEnum } from './typings';

const weeks = ['一', '二', '三', '四', '五', '六', '日'];
// 当前日期
const currentDate = ref(new Date());
// 扩充为三个月的数据,用于滑动展示
const dates = computed(() => {
  return [
    addMonths(currentDate.value, -1),
    currentDate.value,
    addMonths(currentDate.value, 1),
  ];
});
const DEFAULT_INDEX = Math.floor(dates.value.length / 2);
// 当前展示的月份
const currentIndex = ref(DEFAULT_INDEX);
// 滑动偏移量百分数
const offsetPercentX = ref(0);
// 过渡动画开关
const isTransition = ref(false);
// 滑动区域元素
const swipeContainer = ref<HTMLElement>();
const calenderShapeStatus = ref<CalendarShapeStatusEnum>(
  CalendarShapeStatusEnum.NORMAL,
);

const resetState = () => {
  currentDate.value = dates.value[currentIndex.value];
  isTransition.value = false;
  // 重置为1,这样就能保证 3 条数据无限循环
  currentIndex.value = DEFAULT_INDEX;
};

// 开始滑动的时间, 用于判断是否是快速滑动
let swipeStartTime = 0;
const isSwipeSuccess = (distance: number, maxDistance = 100) => {
  if (distance >= maxDistance) return true;
  return Date.now() - swipeStartTime <= 300 && distance >= 30;
};

const getDayText = () => {
  const texts = ['大前天', '前天', '昨天', '今天', '明天', '后天', '大后天'];

  const diffDays = differenceInDays(currentDate.value, new Date());
  const index = diffDays + texts.findIndex((text) => text === '今天');

  if (texts[index]) return texts[index];
  return `${Math.abs(diffDays)}${diffDays > 0 ? '天后' : '天前'}`;
};

// 左右滑动
const handlePanX: TouchPanValue = ({
  direction,
  distance,
  isFinal,
  isFirst,
}) => {
  if (currentIndex.value !== DEFAULT_INDEX) return;
  // 滑动过程中关闭过渡, 结束时开启过渡
  isTransition.value = !!isFinal;
  if (isFirst) {
    swipeStartTime = Date.now();
  }
  const maxWidth = Screen.width;
  const x = Math.min(distance?.x || 0, maxWidth);
  if (!x) return;
  let sign = direction === 'left' ? 1 : -1;
  offsetPercentX.value = ((sign * x) / maxWidth / dates.value.length) * 100;
  if (!isFinal) return;

  // 什么情况下切换
  if (isSwipeSuccess(x, Screen.width / 2)) {
    // 切换月份时开启过渡动画
    currentIndex.value += sign;
    // 直接滑动到终点,不会触发 transitionEnd
    if (Math.abs(offsetPercentX.value) === 100 / dates.value.length) {
      resetState();
    }
  }
  offsetPercentX.value = 0;
};

// 过渡动画结束后,重置一些数据
const handleSwipeTransitionEnd = () => {
  resetState();
};
</script>

<template>
  <div class="bg-slate-50 h-screen flex flex-col">
    <div class="flex justify-between mb-2">
      <q-btn flat class="text-lg">
        <div class="flex items-center">
          <span>{{ format(currentDate, 'yyyy年MM月') }}</span>
          <q-icon name="arrow_drop_down" />
        </div>
      </q-btn>
      <div>
        <q-btn flat class="text-base py-0 px-2" icon="search" />
        <q-btn flat class="text-base py-0 px-2" icon="filter_alt" />
        <q-btn flat class="text-base py-0 px-2" icon="more_vert" />
      </div>
    </div>
    <!-- 星期 -->
    <div class="flex px-1" style="padding-left: 24px">
      <div
        v-for="week in weeks"
        :key="week"
        class="text-center text-base"
        :style="{
          width: `${100 / 7}%`,
        }"
      >
        {{ week }}
      </div>
    </div>
    <!-- 滑动区域 -->
    <div
      class="w-screen h-full overflow-hidden flex-1"
      v-touch-pan.horizontal.preserveCursor.capture.mouse="handlePanX"
    >
      <div
        ref="swipeContainer"
        @transitionend="handleSwipeTransitionEnd"
        :class="[
          'flex flex-nowrap items-start sticky h-full',
          {
            'transition-all': isTransition,
            'bg-white rounded-t-xl':
              CalendarShapeStatusEnum.EXPANED === calenderShapeStatus,
            'bg-slate-50':
              CalendarShapeStatusEnum.EXPANED !== calenderShapeStatus,
          },
        ]"
        :style="{
          transform: `translateX(-${(100 / dates.length) * currentIndex + offsetPercentX}%)`,
          width: `${100 * dates.length}vw`,
        }"
      >
        <ScheduleItem
          v-for="(date, index) in dates"
          :key="startOfMonth(date).toString()"
          :calenderShapeStatus="calenderShapeStatus"
          :index="index"
          :onCalenderShapeStatusChange="
            (status) => {
              calenderShapeStatus = status;
            }
          "
        >
          <template #calendar>
            <Calendar
              class="w-screen"
              :value="date"
              @change="(v) => (currentDate = v)"
              :isExpaned="
                CalendarShapeStatusEnum.EXPANED === calenderShapeStatus
              "
            />
          </template>
          <template #schedule>
            <div class="sticky top-0 z-1 bg-slate-50">
              <span class="font-semibold inline-block mr-1">{{
                getDayText()
              }}</span>
              <span> {{ lunisolar(date).format('lMlD') }}</span>
            </div>
            <div>没有日程 {{ startOfMonth(date).toString() }}</div>
            <div v-for="i in 100" :key="i" class="bg-white ma-2 rounded">
              日程-{{ i }}
            </div>
          </template>
        </ScheduleItem>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
