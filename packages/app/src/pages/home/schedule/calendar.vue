<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  addDays,
  endOfMonth,
  getDate,
  getDay,
  getDaysInMonth,
  startOfMonth,
} from 'date-fns';
import lunisolar from 'lunisolar';

const currentDate = ref(new Date());
const weeks = ['一', '二', '三', '四', '五', '六', '七'];
interface DayOption {
  // 公历
  gregorian: Date;
  // 农历
  lunar: lunisolar.Lunisolar;
}
const dates = computed(() => {
  const startDate = startOfMonth(currentDate.value);
  const endDate = endOfMonth(currentDate.value);
  const days = getDaysInMonth(currentDate.value);
  //  如果是星期天, getDay 返回值为 0
  const startWeek = getDay(startDate) || 7;
  const endWeek = getDay(endDate);
  const options: DayOption[] = [];
  for (let i = 1 - startWeek; i <= days + 6 - endWeek; i++) {
    const date = addDays(startDate, i);
    options.push({
      gregorian: date,
      lunar: lunisolar(date),
    });
  }
  return options;
});
</script>

<template>
  <div>
    <div class="row">
      <div
        v-for="week in weeks"
        :key="week"
        class="text-center text-subtitle2"
        :style="{
          width: `${100 / 7}%`,
        }"
      >
        {{ week }}
      </div>
    </div>
    <div class="row">
      <div
        v-for="date in dates"
        :key="date.gregorian.toUTCString()"
        class="text-center text-subtitle2"
        :style="{
          width: `${100 / 7}%`,
        }"
      >
        <p>{{ getDate(date.gregorian) }}</p>
        <p>{{ date.lunar.format('lD') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
