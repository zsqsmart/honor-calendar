<script setup lang="ts">
import type { Numeric } from '@hc/app/typings/basic';
import { wrapToArray } from '@hc/app/utils/functions';
import { isEqual } from 'lodash-es';
import type { Ref } from 'vue';
import { computed, isRef, nextTick, ref, watch } from 'vue';

import type { PickerChangeEventParams, PickerColumn } from './picker';
import { pickerProps } from './picker';
import Column from './picker-column.vue';
import {
  assignDefaultFields,
  findOptionByValue,
  formatCascadeColumns,
  getFirstEnabledOption,
  getPickerMode,
  isOptionExist,
} from './utils';

const props = defineProps(pickerProps());
const emit = defineEmits<{
  change: [params: PickerChangeEventParams];
  'update:modelValue': [newValue: Numeric | Numeric[]];
}>();
const selectedValues = ref(wrapToArray(props.modelValue).slice());
const fields = computed(() => assignDefaultFields(props.fieldNames));
const mode = computed(() => getPickerMode(props.columns, fields.value));
const currentColumns = computed((): PickerColumn[] => {
  const { columns } = props;
  switch (mode.value) {
    case 'multiple':
      return columns as PickerColumn[];
    case 'cascade':
      return formatCascadeColumns(columns, fields.value, selectedValues.value);
    default:
      return [columns] as PickerColumn[];
  }
});

const selectedOptions = computed(() =>
  currentColumns.value.map((options, index) =>
    findOptionByValue(options, selectedValues.value[index], fields.value),
  ),
);

const selectedIndexes = computed(() =>
  currentColumns.value.map((options, index) =>
    options.findIndex(
      (option) => option[fields.value.value] === selectedValues.value[index],
    ),
  ),
);

const toParentValue = (values: any[] | Ref<any[]>) => {
  const newValues = isRef(values) ? values.value : values;
  return mode.value === 'default' ? newValues[0] : newValues;
};

const getEventParams = <T extends Record<string, any>>(extraParams: T) => {
  return Object.assign(
    {
      selectedValues: toParentValue(selectedValues),
      selectedIndexes: toParentValue(selectedIndexes),
      selectedOptions: toParentValue(selectedOptions),
    },
    extraParams,
  );
};

const setValue = (columnIndex: number, value: Numeric) => {
  if (selectedValues.value[columnIndex] !== value) {
    const newValues = selectedValues.value.slice();
    newValues[columnIndex] = value;
    selectedValues.value = newValues;
  }
};

const handleChange = (columnIndex: number, value: Numeric) => {
  setValue(columnIndex, value);
  if (mode.value === 'cascade') {
    // reset values after cascading
    selectedValues.value.forEach((value, index) => {
      const options = currentColumns.value[index];
      if (!isOptionExist(options, value, fields.value)) {
        setValue(
          index,
          options.length ? options[0][fields.value.value] : undefined,
        );
      }
    });
  }
  nextTick(() => {
    emit(
      'change',
      getEventParams({
        columnIndex,
      }),
    );
  });
};
watch(
  currentColumns,
  (columns) => {
    columns.forEach((options, index) => {
      if (
        options.length &&
        !isOptionExist(options, selectedValues.value[index], fields.value)
      ) {
        setValue(index, getFirstEnabledOption(options)![fields.value.value]);
      }
    });
  },
  { immediate: true },
);

// preserve last emitted model value
// when props.modelValue is updated by parent component,
// the new value should be compared with the last emitted value
let lastEmittedModelValue: Numeric[];
watch(
  () => props.modelValue,
  (newValues) => {
    if (
      !isEqual(wrapToArray(newValues), selectedValues.value) &&
      !isEqual(wrapToArray(newValues), lastEmittedModelValue)
    ) {
      selectedValues.value = wrapToArray(newValues).slice();
      lastEmittedModelValue = wrapToArray(newValues).slice();
    }
  },
  { deep: true },
);
watch(
  selectedValues,
  (newValues) => {
    if (!isEqual(newValues, props.modelValue)) {
      lastEmittedModelValue = newValues.slice();
      emit('update:modelValue', lastEmittedModelValue);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="relative">
    <div class="mask-top border-slate-200 border-b-1"></div>
    <div class="mask-bottom border-slate-200 border-t-1"></div>
    <div class="wheel-wrapper">
      <template
        v-for="(options, columnIndex) in currentColumns"
        :key="columnIndex"
      >
        <Column
          :options="options"
          :value="selectedValues[columnIndex]"
          :fields="fields"
          @change="(v) => handleChange(columnIndex, v)"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wheel-wrapper {
  display: flex;
  padding: 0 16px;
}
.mask-top,
.mask-bottom {
  z-index: 10;
  width: 100%;
  height: 68px;
  pointer-events: none;
  transform: translateZ(0);
  position: absolute;
}
.mask-top {
  top: 0;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.8)
  );
}
.mask-bottom {
  bottom: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.8)
  );
}
</style>
