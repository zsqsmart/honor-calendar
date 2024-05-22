<script setup lang="ts">
import { clamp } from 'lodash-es';
import { dom, type TouchPanValue } from 'quasar';
import type { PropType } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';

import { CalendarShapeStatusEnum } from './typings';

const CALENDAR_ROW_HEIGHT = 71;

const props = defineProps({
  calenderShapeStatus: {
    type: String as PropType<CalendarShapeStatusEnum>,
    default: CalendarShapeStatusEnum.NORMAL,
  },
  onCalenderShapeStatusChange: {
    type: Function as PropType<(status: CalendarShapeStatusEnum) => void>,
    required: true,
  },
});

const wrapper = ref<HTMLDivElement>();
const calendarWrapper = ref<HTMLDivElement>();
const scheduleContainer = ref<HTMLDivElement>();
// 过渡动画开关
const isTransition = ref(false);
// 日历的高度
const calendarHeight = ref(-1);
const calendarOriginHeight = ref(0);

let swipeStartTime = 0;
const isSwipeSuccess = (distance: number, maxDistance = 100) => {
  if (distance >= maxDistance) return true;
  return Date.now() - swipeStartTime <= 300 && distance >= 30;
};

let startHeight = 0;
let isScheduleScrolledTop = true;
// 上下滑动
const handlePanY: TouchPanValue = ({
  direction,
  distance,
  isFinal,
  isFirst,
  evt,
}) => {
  if (!isScheduleScrolledTop) return;
  // 滑动过程中关闭过渡, 结束时开启过渡
  isTransition.value = !!isFinal;
  const y = distance?.y || 0;
  if (!y) return;

  if (isFirst) {
    const calendarEl = calendarWrapper.value;
    const wrapperEl = wrapper.value;
    if (!calendarEl || !wrapperEl) return;
    swipeStartTime = Date.now();
    startHeight = dom.height(calendarEl);
    // 获取原始高度
    calendarEl.style.height = 'auto';
    calendarOriginHeight.value = dom.height(calendarEl);
    calendarEl.style.height = `${startHeight}px`;
  }
  if (
    props.calenderShapeStatus === CalendarShapeStatusEnum.NORMAL &&
    direction === 'up'
  ) {
    if (isFinal) {
      if (isSwipeSuccess(y)) {
        props.onCalenderShapeStatusChange(CalendarShapeStatusEnum.FOLD);
        scrollToBottom();
      } else {
        scrollToTop();
      }
    }
    return;
  }
  if (
    props.calenderShapeStatus === CalendarShapeStatusEnum.FOLD &&
    direction === 'down'
  ) {
    if (isFinal) {
      if (isSwipeSuccess(y)) {
        props.onCalenderShapeStatusChange(CalendarShapeStatusEnum.NORMAL);
        scrollToTop();
      } else {
        scrollToBottom();
      }
    }
    return;
  }

  if (props.calenderShapeStatus === CalendarShapeStatusEnum.FOLD) return;
  if (props.calenderShapeStatus === CalendarShapeStatusEnum.EXPANED) {
    evt?.preventDefault();
  }
  let sign = direction === 'down' ? 1 : -1;
  const maxHeight = dom.height(wrapper.value!.parentElement!);
  calendarHeight.value = clamp(
    startHeight + sign * y,
    calendarOriginHeight.value,
    maxHeight,
  );
  if (!isFinal) return;
  // 已经滑动到了终点,这个时候是不会触发 transition end 事件的
  if ([calendarOriginHeight.value, maxHeight].includes(calendarHeight.value)) {
    isTransition.value = false;
    return;
  }
  // 什么情况下切换
  if (isSwipeSuccess(y)) {
    if (sign > 0) {
      props.onCalenderShapeStatusChange(CalendarShapeStatusEnum.EXPANED);
      calendarHeight.value = maxHeight;
    } else {
      props.onCalenderShapeStatusChange(CalendarShapeStatusEnum.NORMAL);
      calendarHeight.value = calendarOriginHeight.value;
    }
  } else {
    calendarHeight.value = startHeight;
  }
};

const computedCalendarHeight = computed(() => {
  if (calendarHeight.value > 0) return `${calendarHeight.value}px`;

  return props.calenderShapeStatus === CalendarShapeStatusEnum.EXPANED
    ? '100%'
    : 'auto';
});

const updateIsScheduleScrolledTop = () => {
  isScheduleScrolledTop = scheduleContainer.value?.scrollTop === 0;
};

// 过渡动画结束后,重置一些数据
const handleSwipeTransitionEnd = () => {
  calendarHeight.value = -1;
  isTransition.value = false;
};

const handleScheduleTouch = (evt: TouchEvent) => {
  updateIsScheduleScrolledTop();
  if (props.calenderShapeStatus === CalendarShapeStatusEnum.NORMAL) {
    evt?.preventDefault();
  }
  if (props.calenderShapeStatus === CalendarShapeStatusEnum.FOLD) {
    if (!isScheduleScrolledTop) {
      evt?.stopPropagation();
    }
  }
  if (props.calenderShapeStatus === CalendarShapeStatusEnum.EXPANED) {
  }
};

const scrollToTop = (isSmooth = true) => {
  if (!wrapper.value) return;
  wrapper.value.scrollTo({
    top: 0,
    behavior: isSmooth ? 'smooth' : 'instant',
  });
};

const scrollToBottom = (isSmooth = true) => {
  if (!wrapper.value) return;
  wrapper.value.scrollTo({
    top: wrapper.value.scrollHeight,
    behavior: isSmooth ? 'smooth' : 'instant',
  });
};

onMounted(() => {
  setTimeout(() => {
    calendarOriginHeight.value = dom.height(calendarWrapper.value!);
  });

  if (props.calenderShapeStatus === CalendarShapeStatusEnum.FOLD) {
    setTimeout(() => {
      scrollToBottom(false);
    });
  }
});

watch(
  () => props.calenderShapeStatus,
  (status) => {
    if (!wrapper.value) return;
    if (status === CalendarShapeStatusEnum.FOLD) {
      scrollToBottom();
    } else {
      scrollToTop();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div
    ref="wrapper"
    :class="{
      'h-full overflow-y-scroll w-screen flex-shrink-0': true,
      'transition-all': isTransition,
    }"
    :style="{}"
    v-touch-pan.vertical.preserveCursor.mouse="handlePanY"
  >
    <div class="h-full">
      <div
        ref="calendarWrapper"
        :class="{
          'sticky relative z-10': true,
          'transition-all': isTransition,
        }"
        :style="{
          height: computedCalendarHeight,
          top: `${-calendarOriginHeight + CALENDAR_ROW_HEIGHT}px`,
        }"
        @transitionend="handleSwipeTransitionEnd"
      >
        <slot name="calendar" />
      </div>
      <div
        class="overflow-y-scroll scroll-smooth"
        :style="{
          height: `calc(100% - ${CALENDAR_ROW_HEIGHT}px)`,
        }"
        @touchstart="handleScheduleTouch"
        @touchmove="handleScheduleTouch"
        ref="scheduleContainer"
      >
        <slot name="schedule" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
