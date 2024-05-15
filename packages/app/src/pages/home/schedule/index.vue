<script setup lang="ts">
import { addMonths, format } from 'date-fns';
import { dom, type TouchPanValue } from 'quasar';
import { computed, ref } from 'vue';

import Calendar from './calendar.vue';

const currentDate = ref(new Date());
const weeks = ['一', '二', '三', '四', '五', '六', '日'];
// 当前展示的月份
const currentIndex = ref(1);
// 滑动偏移量百分数
const offsetPercent = ref(0);
// 过渡动画开关
const isTransition = ref(false);

// 扩充为三个月的数据,用于滑动展示
const dates = computed(() => {
  return [
    addMonths(currentDate.value, -1),
    currentDate.value,
    addMonths(currentDate.value, 1),
  ];
});

const handlePan: TouchPanValue = ({ direction, distance, isFinal }) => {
  const maxWidth = dom.width(document.body);
  const x = Math.min(distance?.x || 0, maxWidth);
  if (!x) return;
  let sign = direction === 'left' ? 1 : -1;
  // 滑动过程中关闭过渡
  isTransition.value = false;
  offsetPercent.value = ((sign * x) / maxWidth / dates.value.length) * 100;
  if (!isFinal) return;
  offsetPercent.value = 0;
  // 滑动超过一定距离,才切换月份
  if (x > 20) {
    // 切换月份时开启过渡动画
    isTransition.value = true;
    currentIndex.value += sign;
  }
};

// 过渡动画结束后,重置一些数据
const handleSwipeEnd = () => {
  currentDate.value = dates.value[currentIndex.value];
  isTransition.value = false;
  // 重置为1,这样就能保证 3 条数据无限循环
  currentIndex.value = 1;
};
</script>

<template>
  <div>
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
    <div class="flex">
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
    <div class="w-screen overflow-hidden" v-touch-pan.prevent.mouse="handlePan">
      <div class="inline-block">
        <div
          @transitionend="handleSwipeEnd"
          :class="[
            'flex flex-nowrap',
            {
              transition: isTransition,
            },
          ]"
          :style="{
            transform: `translateX(-${(100 / dates.length) * currentIndex + offsetPercent}%)`,
          }"
        >
          <Calendar
            v-for="date in dates"
            :key="date.toString()"
            class="w-screen"
            :value="date"
            @change="(v) => (currentDate = v)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
