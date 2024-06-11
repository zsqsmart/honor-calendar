<script setup lang="ts">
import { getScaffoldProps } from './typings';

defineOptions({
  name: 'hc-scaffold',
  inheritAttrs: false,
});

const props = defineProps(getScaffoldProps());
</script>
<template>
  <q-layout
    view="hHh LpR fFf"
    container
    class="hc-scaffold h-screen bg-slate-50"
  >
    <q-header
      v-if="props.showHeader"
      class="bg-transparent text-gray-800 h-14 flex items-center"
    >
      <slot name="header" />
    </q-header>

    <q-footer v-if="props.showFooter" class="bg-transparent text-gray-800">
      <slot name="footer" />
    </q-footer>

    <q-page-container class="hc-scaffold-page-container h-full">
      <q-page class="h-full">
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
.hc-scaffold {
  & > .absolute-full > .scroll {
    height: 100%;
    & > .q-layout.q-layout--containerized {
      height: 100%;
    }
  }
}
.hc-scaffold-page-container {
  & > div {
    height: 100%;
  }
}
</style>
