import { makeRequiredProp } from '@hc/app/typings/vue-props';
import { ExtractPropTypes } from 'vue';

export const getDatePickerProps = () => ({
  currentTime: makeRequiredProp(Date),
});

export type DatePickerProps = ExtractPropTypes<
  ReturnType<typeof getDatePickerProps>
>;
