<script setup lang="ts">
import ScheduleDB from '@hc/app/utils/schedule';
import { differenceInDays, formatDate } from 'date-fns';
import lunisolar from 'lunisolar';
import { computed } from 'vue';

const props = defineProps({
  date: {
    type: Date,
    required: true,
  },
});

const getDayText = () => {
  const texts = ['大前天', '前天', '昨天', '今天', '明天', '后天', '大后天'];

  const diffDays = differenceInDays(props.date, new Date());
  const index = diffDays + texts.findIndex((text) => text === '今天');

  if (texts[index]) return texts[index];
  return `${Math.abs(diffDays)}${diffDays > 0 ? '天后' : '天前'}`;
};

const scheduleList = computed(() => {
  return ScheduleDB.getItemByTime(props.date);
});
</script>

<template>
  <div class="sticky top-0 z-1 bg-slate-50 px-4">
    <span class="font-semibold inline-block mr-1">{{ getDayText() }}</span>
    <span> {{ lunisolar(props.date).format('lMlD') }}</span>
  </div>
  <div
    v-if="!scheduleList.length"
    class="flex flex-col items-center justify-center pt-10"
  >
    <q-icon name="eva-slash-outline" class="text-16 text-gray-300" />
    <div>没有日程</div>
  </div>
  <div
    v-else
    v-for="schedule in scheduleList"
    :key="schedule.id"
    class="bg-white ma-2 rounded"
  >
    <div>
      <div v-if="schedule.isAllDay">全天</div>
      <div>
        <p>{{ formatDate(schedule.startTime, 'HH:mm') }}</p>
        <p>{{ formatDate(schedule.endTime, 'HH:mm') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
