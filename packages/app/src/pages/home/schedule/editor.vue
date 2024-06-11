<script setup lang="ts">
import DatePicker from '@hc/app/components/date-picker';
import { smartFormatDate } from '@hc/app/utils/date';
import ScheduleDB from '@hc/app/utils/schedule';
import {
  addHours,
  addMinutes,
  format,
  getMinutes,
  startOfHour,
} from 'date-fns';
import { nanoid } from 'nanoid';
import { reactive, ref } from 'vue';

import { useGeoStore } from '../../geo/store';

const geoStore = useGeoStore();
const now = new Date();
const startTime = addMinutes(
  startOfHour(now),
  Math.ceil(getMinutes(now) / 30) * 30,
);
const endTime = addHours(startTime, 1);
const datePickerVisible = ref(false);
const modifyTimeMode = ref<'startTime' | 'endTime'>('startTime');

const formData = reactive({
  title: '',
  isAllDay: false,
  desc: '',
  startTime: startTime,
  endTime: endTime,
  noticeAdvance: '30m',
  noticeInterval: 0,
});

const templateOptions = [
  {
    key: 'default',
    label: '默认',
    icon: 'eva-calendar-outline',
  },
  {
    key: 'important',
    label: '重要日',
    icon: 'eva-star-outline',
  },
  {
    key: 'birthday',
    label: '生日',
    icon: 'eva-gift-outline',
  },
  {
    key: 'todo',
    label: '待办',
    icon: 'eva-checkmark-circle-2-outline',
  },
];
const currentType = ref('default');

const showTimePicker = (mode: 'startTime' | 'endTime') => {
  modifyTimeMode.value = mode;
  datePickerVisible.value = true;
};
const handleTimeChange = (time: Date) => {
  if (modifyTimeMode.value === 'startTime') {
    if (time.getTime() >= formData.endTime.getTime()) return;
  } else {
    if (time.getTime() <= formData.startTime.getTime()) return;
  }
  formData[modifyTimeMode.value] = time;
};
const handleOk = () => {
  ScheduleDB.addSchedule({
    ...formData,
    id: nanoid(),
    location: `${geoStore.lngLat?.getLng()},${geoStore.lngLat?.getLat()}`,
    startTime: formData.startTime.toUTCString(),
    endTime: formData.endTime.toUTCString(),
  });
};
</script>

<template>
  <hc-scaffold>
    <template #header>
      <q-toolbar>
        <q-btn to="/schedule" flat round dense icon="eva-close-outline" />
        <q-toolbar-title>新建日程</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="eva-checkmark-outline"
          @click="handleOk"
        />
      </q-toolbar>
    </template>

    <div class="flex justify-around mb-6">
      <div
        class="flex flex-col items-center"
        v-for="templateOption in templateOptions"
        :key="templateOption.key"
        @click="currentType = templateOption.key"
      >
        <q-btn
          round
          :color="currentType === templateOption.key ? 'primary' : undefined"
          :icon="templateOption.icon"
        />
        <div
          :class="{
            'transition mt-1': true,
            'text-primary': currentType === templateOption.key,
          }"
        >
          {{ templateOption.label }}
        </div>
      </div>
    </div>
    <q-form class="px-2 q-gutter-y-sm">
      <!-- 标题 -->
      <q-input
        autofocus
        dense
        borderless
        v-model="formData.title"
        placeholder="标题"
        bg-color="white"
        :standout="false"
      >
        <template #prepend>
          <q-icon name="eva-text-outline" class="px-3" />
        </template>
      </q-input>
      <!-- 地点 -->
      <q-btn
        unelevated
        color="white"
        text-color="grey-7"
        icon-right="eva-chevron-right-outline"
        class="w-full"
        padding="8px 12px"
        to="/geo"
      >
        <q-icon name="eva-compass-outline" class="q-mr-xs" />
        <span class="">{{
          geoStore.info?.formattedAddress || '选择地点'
        }}</span>
        <q-space />
      </q-btn>
      <!-- 日期选择 -->
      <div
        class="bg-white rounded text-base px-3 py-2 text-sm flex items-start"
      >
        <div class="flex items-center h-10">
          <q-icon size="24px" name="eva-clock-outline" class="mr-1" />
        </div>
        <div class="flex-1">
          <div class="flex items-center">
            <span>全天</span>
            <q-space />
            <q-toggle v-model="formData.isAllDay" />
          </div>
          <q-separator class="mb-1" />
          <div class="flex items-center">
            <div
              class="text-center flex-1"
              @click="showTimePicker('startTime')"
            >
              <div>{{ format(formData.startTime, 'HH:mm') }}</div>
              <div>{{ smartFormatDate(formData.startTime) }}</div>
            </div>
            <div>
              <q-icon size="24px" name="eva-chevron-right-outline" />
            </div>
            <div class="text-center flex-1" @click="showTimePicker('endTime')">
              <div>{{ format(formData.endTime, 'HH:mm') }}</div>
              <div>{{ smartFormatDate(formData.endTime) }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 提醒 -->
      <div
        class="bg-white rounded text-base px-3 py-2 text-sm flex items-start"
      >
        <div style="height: 40px" class="flex items-center">
          <q-icon size="24px" name="eva-bell-outline" class="mr-1" />
        </div>
        <div class="flex-1">
          <q-btn
            color="white"
            text-color="grey-7"
            class="w-full"
            padding="8px 0px"
            unelevated
          >
            提醒
            <q-space />
            <span>30分钟前</span>
            <q-icon name="eva-chevron-right-outline" />
          </q-btn>
          <q-separator class="mb-1" />
          <q-btn
            color="white"
            text-color="grey-7"
            class="w-full"
            padding="8px 0px"
            unelevated
          >
            再次提醒
            <q-space />
            <span>无</span>
            <q-icon name="eva-chevron-right-outline" />
          </q-btn>
        </div>
      </div>
      <q-input
        v-model="formData.desc"
        autogrow
        placeholder="输入日程计划"
        bg-color="white"
        :standout="false"
        input-class="px-3"
      />
    </q-form>
    <DatePicker
      :currentTime="formData[modifyTimeMode]"
      v-model="datePickerVisible"
      @ok="handleTimeChange"
    />
  </hc-scaffold>
</template>

<style scoped lang="scss"></style>
