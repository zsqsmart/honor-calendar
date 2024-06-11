import { PropType } from 'vue';

import { Numeric } from './basic';

export const numericProp = [Number, String];

export const makeArrayProp = <T>() => ({
  type: Array as PropType<T[]>,
  default: () => [],
});
export const makeNumericProp = <T>(defaultVal?: T) => ({
  type: numericProp as PropType<Numeric>,
  default: defaultVal,
});

export const makeRequiredProp = <T>(type: T) => ({
  type,
  required: true as const,
});
