import { ExtractPropTypes } from 'vue';

export const getScaffoldProps = () => ({
  hideHeader: {
    type: Boolean,
    default: false,
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
});

export type ScaffoldProps = ExtractPropTypes<
  ReturnType<typeof getScaffoldProps>
>;
