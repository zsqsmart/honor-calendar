import type { Numeric } from '@hc/app/typings/basic';
import { makeArrayProp } from '@hc/app/typings/vue-props';
import type { ExtractPropTypes, PropType } from 'vue';

export type PickerFieldNames = {
  label?: string;
  value?: Numeric;
  children?: string;
};

export interface PickerOption {
  label?: string;
  disabled?: boolean;
  value?: Numeric;
  children?: PickerColumn;
  className?: unknown;
  [key: PropertyKey]: any;
}

export type PickerColumn = PickerOption[];

export type PickerConfirmEventParams = {
  selectedValues: Numeric[];
  selectedOptions: Array<PickerOption | undefined>;
  selectedIndexes: number[];
};

export const PICKER_MODES = ['default', 'multiple', 'cascade'] as const;

export type PickerMode = (typeof PICKER_MODES)[number];

export const pickerProps = () => ({
  columns: makeArrayProp<PickerOption | PickerColumn>(),
  fieldNames: Object as PropType<PickerFieldNames>,
  mode: {
    type: String,
    default: 'default' as PickerMode,
  },
  modelValue: {
    type: [Array, String, Number] as PropType<Numeric[] | Numeric>,
    default: () => [],
  },
});

export type PickerProps = ExtractPropTypes<ReturnType<typeof pickerProps>>;

export interface PickerChangeEventParams<T extends PickerMode = any> {
  columnIndex: number;
  selectedValues: T extends 'default' ? Numeric : Numeric[];
  selectedIndexes: T extends 'default' ? number : number[];
  selectedOptions: T extends 'default'
    ? PickerOption | undefined
    : Array<PickerOption | undefined>;
}
