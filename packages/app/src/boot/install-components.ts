import { boot } from 'quasar/wrappers';

import Scaffold from '../components/scaffold';

export default boot(({ app }) => {
  app.use(Scaffold);
});
