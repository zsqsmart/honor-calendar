import type { Numeric } from '@hc/app/typings/basic';
import { clamp, isNil } from 'lodash-es';

import type { PickerColumn, PickerOption } from './picker';
import {
  PICKER_MODES,
  type PickerFieldNames,
  type PickerMode,
  type PickerProps,
} from './picker';

export const DEFAULT_SWIPE_DURATION = 300;

export const getPickerMode = (
  columns: PickerProps['columns'],
  fields: Required<PickerFieldNames>,
  customMode?: string,
): PickerMode => {
  if (PICKER_MODES.includes(customMode as PickerMode)) {
    return customMode as PickerMode;
  }
  const firstColumn = columns[0];
  if (firstColumn) {
    if (Array.isArray(firstColumn)) {
      return 'multiple';
    }
    if (Array.isArray(firstColumn[fields.children])) {
      return 'cascade';
    }
  }
  return 'default';
};

export const assignDefaultFields = (
  fields: PickerFieldNames | undefined,
): Required<PickerFieldNames> =>
  Object.assign(
    {
      label: 'label',
      value: 'value',
      children: 'children',
    },
    fields,
  );

export const findIndexOfEnabledOption = (
  options: PickerOption[],
  index = 0,
) => {
  index = clamp(index, 0, options.length);

  for (let i = index; i < options.length; i++) {
    if (!options[i].disabled) return i;
  }
  for (let i = index - 1; i >= 0; i--) {
    if (!options[i].disabled) return i;
  }

  return 0;
};

export const findOptionByValue = (
  options: PickerOption[],
  value: Numeric,
  fields: Required<PickerFieldNames>,
): PickerOption | undefined => {
  const index = options.findIndex((option) => option[fields.value] === value);
  const enabledIndex = findIndexOfEnabledOption(options, index);
  return options[enabledIndex];
};

export const getFirstEnabledOption = (
  options: PickerOption[],
): PickerOption | undefined =>
  options.find((option) => !option.disabled) || options[0];

export const isOptionExist = (
  options: PickerOption[],
  value: Numeric | undefined,
  fields: Required<PickerFieldNames>,
) => !isNil(value) && options.some((option) => option[fields.value] === value);

export const formatCascadeColumns = (
  columns: PickerProps['columns'],
  fields: Required<PickerFieldNames>,
  selectedValues: Numeric[],
) => {
  const formatted: PickerColumn[] = [];

  let cursor: PickerOption | undefined = {
    value: '',
    [fields.children]: columns,
  };
  let columnIndex = 0;

  while (cursor && cursor[fields.children]) {
    const options: PickerOption[] = cursor[fields.children] || [];
    const value = selectedValues[columnIndex];

    cursor = !isNil(value)
      ? findOptionByValue(options, value, fields)
      : undefined;

    if (!cursor && options.length) {
      cursor = getFirstEnabledOption(options)![fields.value];
    }

    columnIndex++;
    formatted.push(options);
  }

  return formatted;
};
