import {
  makeArrayProp,
  makeNumericProp,
  makeRequiredProp,
  numericProp,
} from '@hc/app/typings/vue-props';
import type { ExtractPropTypes, PropType } from 'vue';

import type { PickerFieldNames, PickerOption } from './picker';
import { DEFAULT_SWIPE_DURATION } from './utils';

export const pickerColumnProps = () => ({
  value: numericProp,
  fields: makeRequiredProp(Object as PropType<Required<PickerFieldNames>>),
  options: makeArrayProp<PickerOption>(),
  swipeDuration: makeNumericProp(DEFAULT_SWIPE_DURATION),
  optionHeight: String,
  visibleOptionNum: numericProp,
});

export type PickerColumnProps = ExtractPropTypes<
  ReturnType<typeof pickerColumnProps>
>;
