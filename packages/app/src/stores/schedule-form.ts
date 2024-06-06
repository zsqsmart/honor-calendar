import { defineStore } from 'pinia';

import { GeoInfo } from '../typings/geo';

interface State {
  geo: GeoInfo | null;
}

export const useScheduleFormStore = defineStore('schedule-form', {
  state: (): State => ({
    geo: null,
  }),
  actions: {
    setLocation(geo: GeoInfo) {
      this.geo = geo;
    },
  },
});
