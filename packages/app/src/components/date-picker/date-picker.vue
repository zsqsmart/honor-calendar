<script setup lang="ts">
import type { PickerOption } from '@hc/app/components/picker';
import Picker from '@hc/app/components/picker';
import {
  addDays,
  formatDate,
  getDay,
  getHours,
  getMinutes,
  startOfDay,
} from 'date-fns';
import { range } from 'lodash-es';
import { computed, ref } from 'vue';

import { getDatePickerProps } from './date-picker';

const weeks = ['日', '一', '二', '三', '四', '五', '六'];
const visible = defineModel({ type: Boolean });

const props = defineProps(getDatePickerProps());

const emit = defineEmits<{
  ok: [time: Date];
}>();

const time = ref([
  startOfDay(props.currentTime).getTime(),
  getHours(props.currentTime),
  getMinutes(props.currentTime),
]);

const dateOptions = computed(() => {
  const options: PickerOption[] = [];
  for (let i = -1200; i <= 1200; i++) {
    const date = startOfDay(addDays(props.currentTime, i));
    options.push({
      value: date.getTime(),
      label: formatDate(date, 'MM月dd日'),
    });
  }
  return [
    options,
    range(24).map((hour) => {
      return {
        value: hour,
        label: hour.toString().padStart(2, '0'),
      };
    }),
    range(60).map((munite) => {
      return {
        value: munite,
        label: munite.toString().padStart(2, '0'),
      };
    }),
  ];
});

const handleOk = () => {
  emit(
    'ok',
    new Date(time.value[0] + time.value[1] * 3600000 + time.value[2] * 60000),
  );
  visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
};
</script>

<template>
  <q-dialog full-width v-model="visible" position="bottom">
    <div class="bg-white">
      <div class="py-2 pl-3 font-medium text-base">
        {{ formatDate(time[0], 'yyyy年MM月dd日') }}星期{{
          weeks[getDay(time[0])]
        }}
      </div>
      <Picker :columns="dateOptions" v-model="time" />
      <div class="flex items-center">
        <q-btn flat color="primary" class="flex-1" @click="handleCancel"
          >取消</q-btn
        >
        <q-separator vertical inset />
        <q-btn flat color="primary" class="flex-1" @click="handleOk"
          >确定</q-btn
        >
      </div>
    </div>
  </q-dialog>
</template>

<style scoped lang="scss"></style>
