<script setup lang="ts">
import { Geolocation } from '@capacitor/geolocation';
import { onMounted, reactive, ref } from 'vue';

const formData = reactive({
  title: '',
  isAllDay: false,
  desc: '',
});

const printCurrentPosition = async () => {
  const coordinates = await Geolocation.getCurrentPosition();

  console.log('Current position:', coordinates);
};

onMounted(() => {
  printCurrentPosition();
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
</script>

<template>
  <hc-scaffold>
    <template #header>
      <q-toolbar>
        <q-btn to="/schedule" flat round dense icon="eva-close-outline" />
        <q-toolbar-title>新建日程</q-toolbar-title>
        <q-btn flat round dense icon="eva-checkmark-outline" />
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
      <q-input
        autofocus
        dense
        v-model="formData.title"
        placeholder="标题"
        bg-color="white"
        standout="bg-teal text-white"
      >
        <template #prepend>
          <q-icon name="eva-text-outline" />
        </template>
      </q-input>
      <q-btn
        color="white"
        text-color="grey-7"
        icon-right="eva-chevron-right-outline"
        class="w-full"
        padding="8px 12px"
        unelevated
      >
        <q-icon name="eva-compass-outline" class="q-mr-xs" />
        地点
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
          <div class="flex justify-around items-center">
            <div class="text-center">
              <div>15:30</div>
              <div>5月 15 日</div>
            </div>
            <div>
              <q-icon size="24px" name="eva-chevron-right-outline" />
            </div>
            <div class="text-center">
              <div>18:30</div>
              <div>5月 15 日</div>
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
        standout="bg-teal text-white"
      />
    </q-form>
  </hc-scaffold>
</template>

<style scoped lang="scss"></style>
