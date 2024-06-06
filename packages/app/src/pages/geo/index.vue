<script setup lang="ts">
import { Geolocation } from '@capacitor/geolocation';
import type { GeoInfo } from '@hc/app/typings/geo';
import aMap from '@hc/app/utils/amap';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useGeoStore } from './store';
import TipList from './tip-list.vue';

const router = useRouter();
const geoStore = useGeoStore();

const keyword = ref('');
const searchTips = ref<GeoInfo[]>([]);
const mapContainer = ref<HTMLDivElement>();
const searchTipsVisible = ref(false);

let mapIns: AMap.Map;
const autoComplete = new aMap.AutoComplete({
  // 限定城市，默认全国
  city: '全国',
});

// 获取当前经纬度
const loadCurrentLngLat = async () => {
  const coordinates = await Geolocation.getCurrentPosition();

  await geoStore.setLngLat(
    new AMap.LngLat(coordinates.coords.longitude, coordinates.coords.latitude),
  );
};

const handleTipClick = async (lngLat: AMap.LngLat | null) => {
  await geoStore.setLngLat(lngLat);
  searchTipsVisible.value = false;
  router.back();
};

watch(keyword, (kw) => {
  searchTipsVisible.value = !!kw;
  if (!kw) {
    searchTips.value = [];
    return;
  }
  autoComplete.search(kw, function (status, result) {
    //搜索成功时，result 即是对应的匹配数据
    if (typeof result === 'string') return;
    searchTips.value = result.tips;
  });
});

watch(
  () => geoStore.lngLat,
  async (lngLat) => {
    if (!lngLat) return;
    mapIns.setCenter(lngLat);
  },
);

onMounted(async () => {
  if (!mapContainer.value) return;

  mapIns = new aMap.Map(mapContainer.value, {
    zoom: 12,
  });

  await loadCurrentLngLat();
});
</script>

<template>
  <hc-scaffold>
    <template #header>
      <div class="flex items-center px-3 bg-slate-50 flex-1">
        <q-icon
          size="24px"
          name="eva-arrow-back-outline"
          class="mr-2"
          @click="router.back()"
        />
        <q-input
          dense
          borderless
          type="search"
          class="flex-1 rounded-full overflow-hidden"
          bg-color="white"
          debounce="300"
          v-model="keyword"
        >
          <template #prepend>
            <q-icon name="eva-search-outline" class="px-2" />
          </template>
          <template #append>
            <q-icon
              name="eva-close-outline"
              class="px-2"
              @click="keyword = ''"
            />
          </template>
        </q-input>
      </div>
    </template>
    <div class="h-full flex flex-col mx-2 overflow-hidden">
      <div class="mb-2"></div>
      <div ref="mapContainer" class="h-80 mb-4 rounded-xl" />
      <q-item
        clickable
        v-ripple
        class="bg-white mx-2 mb-4 rounded-4"
        @click="handleTipClick(geoStore.lngLat)"
      >
        <q-item-section avatar style="min-width: auto">
          <q-icon name="eva-pin-outline" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ geoStore.info?.formattedAddress }}</q-item-label>
          <q-item-label caption lines="1"
            >{{ geoStore.info?.addressComponent.province
            }}{{ geoStore.info?.addressComponent.city
            }}{{ geoStore.info?.addressComponent.district }}</q-item-label
          >
        </q-item-section>
      </q-item>
      <div class="text-sm mb-2 px-4 mx-2">附近地点</div>

      <div class="overflow-y-scroll flex-1">
        <TipList
          :tips="geoStore.info?.pois"
          class="bg-white rounded-xl mx-2"
          @click="handleTipClick"
        />
      </div>
    </div>
    <q-page-sticky position="top" expand class="z-10 bg-slate-50 rounded-b-xl">
      <Transition name="expand-y">
        <TipList
          :tips="searchTips"
          v-if="searchTipsVisible"
          class="w-screen"
          @click="handleTipClick"
        />
      </Transition>
    </q-page-sticky>
  </hc-scaffold>
</template>

<style scoped lang="scss"></style>
