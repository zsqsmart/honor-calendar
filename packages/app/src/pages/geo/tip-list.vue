<script setup lang="ts">
import type { GeoInfo } from '@hc/app/typings/geo';
import type { PropType } from 'vue';

const props = defineProps({
  tips: {
    type: Array as PropType<GeoInfo[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  click: [lngLat: AMap.LngLat];
}>();
</script>

<template>
  <div class="px-sm">
    <q-list>
      <template v-for="tip in props.tips" :key="tip.address">
        <q-item
          clickable
          v-ripple
          @click="emit('click', tip.location)"
          class="pl-0"
        >
          <q-item-section avatar style="min-width: auto">
            <q-icon name="eva-pin-outline" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ tip.name }}</q-item-label>
            <q-item-label caption lines="1">{{ tip.address }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="ml-10 mr-4" />
      </template>
    </q-list>
  </div>
</template>

<style scoped lang="scss"></style>
