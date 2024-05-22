import presetRemToPx from '@unocss/preset-rem-to-px';
import { defineConfig, presetWind } from 'unocss';

export default defineConfig({
  theme: {
    colors: {
      primary: '#1976d2',
    },
  },
  presets: [presetWind(), presetRemToPx],
  rules: [
    [
      'text-xss',
      {
        'font-size': '0.625rem',
        'line-height': '0.875rem',
      },
    ],
  ],
});
