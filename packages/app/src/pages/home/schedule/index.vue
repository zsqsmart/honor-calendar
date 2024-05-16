<script setup lang="ts">
import { addMonths, format } from 'date-fns';
import { clamp } from 'lodash-es';
import { dom, Screen, type TouchPanValue } from 'quasar';
import { computed, ref } from 'vue';

import Calendar from './calendar.vue';

const weeks = ['一', '二', '三', '四', '五', '六', '日'];
// 当前日期
const currentDate = ref(new Date());
// 当前展示的月份
const currentIndex = ref(1);
// 滑动偏移量百分数
const offsetPercentX = ref(0);
// 过渡动画开关
const isTransition = ref(false);
// 日历的高度
const calendarHeight = ref(-1);
// 华东区域元素
const swipeWrapper = ref<HTMLElement>();
// 滑动内部元素
const swipeInner = ref<HTMLElement>();
// 日历是否展开
const isCalendarExpanded = ref(false);

const computedCalendarHeight = computed(() => {
  if (calendarHeight.value > 0) return `${calendarHeight.value}px`;
  return isCalendarExpanded.value ? '100%' : 'auto';
});

// 扩充为三个月的数据,用于滑动展示
const dates = computed(() => {
  return [
    addMonths(currentDate.value, -1),
    currentDate.value,
    addMonths(currentDate.value, 1),
  ];
});

let isPanningX = false;

// 开始滑动的时间, 用于判断是否是快速滑动
let swipeStartTime = 0;
const isFastSwipe = (distance: number) => {
  return Date.now() - swipeStartTime <= 300 && distance >= 30;
};

// 左右滑动
const handlePanX: TouchPanValue = ({
  direction,
  distance,
  isFinal,
  isFirst,
}) => {
  if (isFirst) {
    swipeStartTime = Date.now();
  }
  const maxWidth = Screen.width;
  const x = Math.min(distance?.x || 0, maxWidth);
  if (!x) return;
  let sign = direction === 'left' ? 1 : -1;
  // 滑动过程中关闭过渡
  isTransition.value = false;
  offsetPercentX.value = ((sign * x) / maxWidth / dates.value.length) * 100;
  if (!isFinal) return;
  isTransition.value = true;
  offsetPercentX.value = 0;
  // 什么情况下切换
  if (
    // 滑动超过屏幕一半
    x >= Screen.width / 2 ||
    // 或快速左右滑动
    isFastSwipe(x)
  ) {
    // 切换月份时开启过渡动画
    currentIndex.value += sign;
  }
};

let startHeight = 0;
let minHeight = 0;
// 上下滑动
const handlePanY: TouchPanValue = ({
  direction,
  distance,
  isFinal,
  isFirst,
}) => {
  const y = distance?.y || 0;
  if (!y) return;
  const container = swipeInner.value;
  if (!container) return;
  let sign = direction === 'down' ? 1 : -1;
  isTransition.value = false;
  if (isFirst) {
    swipeStartTime = Date.now();
    startHeight = dom.height(container);
    // 获取原始高度
    container.style.height = 'auto';
    minHeight = dom.height(container);
    container.style.height = `${startHeight}px`;
  }
  const maxHeight = dom.height(swipeWrapper.value!);
  calendarHeight.value = clamp(startHeight + sign * y, minHeight, maxHeight);
  if (!isFinal) return;
  isTransition.value = true;
  // 什么情况下切换
  if (
    //  慢速滑动距离超过 100
    y >= 100 ||
    // 或快速上下滑动
    isFastSwipe(y)
  ) {
    if (sign > 0) {
      isCalendarExpanded.value = true;
      calendarHeight.value = maxHeight;
    } else {
      isCalendarExpanded.value = false;
      calendarHeight.value = minHeight;
    }
  } else {
    calendarHeight.value = startHeight;
  }
};

// 处理滑动
const handlePan: TouchPanValue = (details) => {
  if (details.isFirst && details.direction) {
    isPanningX = ['right', 'left'].includes(details.direction);
  }
  if (isPanningX) {
    handlePanX(details);
  } else {
    handlePanY(details);
  }
};

// 过渡动画结束后,重置一些数据
const handleSwipeTransitionEnd = () => {
  currentDate.value = dates.value[currentIndex.value];
  isTransition.value = false;
  // 重置为1,这样就能保证 3 条数据无限循环
  currentIndex.value = 1;
  calendarHeight.value = -1;
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
    <div class="flex px-1">
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
      ref="swipeWrapper"
      class="w-screen overflow-hidden flex-1"
      v-touch-pan.prevent.mouse="handlePan"
    >
      <div class="inline-block h-full">
        <div
          ref="swipeInner"
          @transitionend="handleSwipeTransitionEnd"
          :class="[
            'flex flex-nowrap items-start',
            {
              'transition-all duration-300': isTransition,
            },
          ]"
          :style="{
            transform: `translateX(-${(100 / dates.length) * currentIndex + offsetPercentX}%)`,
            height: computedCalendarHeight,
          }"
        >
          <Calendar
            v-for="date in dates"
            :key="date.toString()"
            class="w-screen"
            :value="date"
            @change="(v) => (currentDate = v)"
            :isExpaned="isCalendarExpanded"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
