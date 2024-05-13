import presetRemToPx from '@unocss/preset-rem-to-px';
import { defineConfig, presetWind } from 'unocss';

export default defineConfig({
  theme: {
    colors: {
      primary: '#1976d2',
    },
  },
  presets: [presetWind(), presetRemToPx],
});
