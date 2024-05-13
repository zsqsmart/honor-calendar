/// <reference types="vite/client" />
/// <reference types="@quasar/app-vite" />

// env
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<
    Record<string, any>,
    Record<string, any>,
    any
  >;
  export default component;
}
