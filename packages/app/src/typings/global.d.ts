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

declare interface Window {
  _AMapSecurityConfig: any;
}

declare namespace AMap {
  // https://lbs.amap.com/api/javascript-api-v2/guide/services/autocomplete#s0
  // JS API 2.0 输入提示插件名称由AMap.Autocomplete变更为AMap.AutoComplete。
  namespace AutoComplete {
    export import Autocomplete = AMap.Autocomplete;
  }

  class AutoComplete extends AMap.Autocomplete {}
}
