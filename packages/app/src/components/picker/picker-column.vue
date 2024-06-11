<script setup lang="ts">
import type { BScrollInstance } from '@better-scroll/core';
import type { Numeric } from '@hc/app/typings/basic';
import BScroll from '@hc/app/utils/bscroll';
import { computed, onMounted, ref, watch } from 'vue';

import { pickerColumnProps } from './picker-column';
import { DEFAULT_SWIPE_DURATION } from './utils';

const props = defineProps(pickerColumnProps());
const emit = defineEmits<{
  change: [value: Numeric];
}>();

const selectedIndex = computed(() =>
  props.options.findIndex(
    (option) => option[props.fields.value] === props.value,
  ),
);

const wheelWrapper = ref<HTMLDivElement>();
let wheel: BScrollInstance;
onMounted(() => {
  wheel = new BScroll(wheelWrapper.value!, {
    wheel: {
      wheelWrapperClass: 'mrb-wheel-scroll',
      wheelItemClass: 'mrb-wheel-item',
      rotate: 30,
      selectedIndex: selectedIndex.value,
      adjustTime: +props.swipeDuration || DEFAULT_SWIPE_DURATION,
      wheelDisabledItemClass: 'mrb-wheel-disabled-item',
    },
    useTransition: false,
    probeType: 3,
  });

  wheel.on('scrollEnd', () => {
    const curIndex: number = wheel.getSelectedIndex();
    emit('change', props.options[curIndex][props.fields.value]);
  });
});

watch(
  () => selectedIndex.value,
  (newIndex) => {
    wheel?.wheelTo(newIndex);
  },
  {},
);
</script>

<template>
  <div class="wheel" ref="wheelWrapper">
    <ul class="mrb-wheel-scroll">
      <li
        v-for="option in props.options"
        :key="option[props.fields.value]"
        :class="{ 'mrb-wheel-disabled-item': option.disabled }"
        class="mrb-wheel-item"
      >
        {{ option[props.fields.label] }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.wheel-wrapper {
  display: flex;
  padding: 0 16px;
  .wheel {
    height: 173px;
    overflow: hidden;
    font-size: 18px;
    flex: 1;
    .mrb-wheel-scroll {
      padding: 0;
      margin-top: 68px;
      line-height: 36px;
      list-style: none;
      justify-content: center;
      .mrb-wheel-item {
        text-align: center;
        height: 36px;
        overflow: hidden;
        white-space: nowrap;
        &.mrb-wheel-disabled-item {
          opacity: 0.2;
        }
      }
    }
  }
}
</style>
