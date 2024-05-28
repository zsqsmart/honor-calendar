<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'App',
});
const transitionName = ref('');

const router = useRouter();
const historyMap = new Map();

router.beforeEach((to, from) => {
  if (!historyMap.get(to.path)) {
    historyMap.set(to.path, new Date().getTime() + 0.3);
  }
  if (!historyMap.has(from.path)) {
    historyMap.set(from.path, new Date().getTime());
  }
  transitionName.value =
    historyMap.get(to.path) > historyMap.get(from.path)
      ? 'slide-forward'
      : 'slide-back';
});
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition appear :name="transitionName">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>
