import { withInstall } from '@hc/app/utils/with-install';

import _Scaffold from './scaffold.vue';
export * from './typings';

const Scaffold = withInstall(_Scaffold);

declare module 'vue' {
  export interface GlobalComponents {
    HcScaffold: typeof Scaffold;
  }
}

export default Scaffold;
