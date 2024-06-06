import { ExtractPropTypes } from 'vue';

export const getScaffoldProps = () => ({
  showHeader: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
});

export type ScaffoldProps = ExtractPropTypes<
  ReturnType<typeof getScaffoldProps>
>;
