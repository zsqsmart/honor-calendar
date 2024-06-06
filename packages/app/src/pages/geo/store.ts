import { aMapPromisify } from '@hc/app/utils/amap';
import { isString } from 'lodash-es';
import { defineStore } from 'pinia';

export interface GeoState {
  lngLat: AMap.LngLat | null;
  info: AMap.Geocoder.ReGeocode | null;
}

const geocoder = new AMap.Geocoder({
  // 以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
  radius: 1000,
  // 返回地址描述以及附近兴趣点和道路信息，默认“base”
  extensions: 'all',
});

const getGeoInfoByLngLat = async (lngLat: AMap.LngLat | null) => {
  if (!lngLat) return null;
  const addressResult = await aMapPromisify(
    geocoder.getAddress,
    geocoder,
  )([lngLat]);
  if (isString(addressResult)) return null;
  return addressResult.regeocodes[0];
};

export const useGeoStore = defineStore('geo', {
  state(): GeoState {
    return {
      lngLat: null,
      info: null,
    };
  },
  actions: {
    async setLngLat(lngLat: AMap.LngLat | null) {
      if (lngLat === this.lngLat) return;
      if (lngLat && this.lngLat && this.lngLat.equals(lngLat)) return;
      this.lngLat = lngLat;
      const info = await getGeoInfoByLngLat(lngLat);
      this.info = info;
    },
  },
});
