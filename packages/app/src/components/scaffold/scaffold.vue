<script setup lang="ts">
import { defineProps } from 'vue';

import { getScaffoldProps } from './typings';

defineOptions({
  name: 'hc-scaffold',
  inheritAttrs: false,
});

const props = defineProps(getScaffoldProps());
</script>
<template>
  <q-layout view="hHh LpR fFf" container class="h-screen bg-slate-50">
    <q-header v-if="!props.hideHeader" class="bg-transparent text-gray-800">
      <slot name="header" />
    </q-header>

    <q-footer v-if="!props.hideFooter" class="bg-transparent text-gray-800">
      <slot name="footer" />
    </q-footer>

    <q-page-container>
      <q-page>
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
