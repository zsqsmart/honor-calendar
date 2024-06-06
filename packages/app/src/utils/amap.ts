// JSAPI手册: https://lbs.amap.com/api/javascript-api-v2/documentation#%e5%9c%b0%e5%9b%be-jsapi-2-0
// 编码表: https://lbs.amap.com/api/webservice/download
// ts类型: https://www.npmjs.com/search?q=types%20amap-js-api-

import AMapLoader from '@amap/amap-jsapi-loader';

window._AMapSecurityConfig = {
  securityJsCode: '1b49aa694daa56f236ad41655d76b339',
};

const aMap: typeof AMap = await AMapLoader.load({
  key: '1048843a4dc9a08c7ee57909f73fae13', //申请好的 Web 端开发者 Key，首次调用 load 时必填
  version: '2.0', //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
  plugins: [
    'AMap.Scale',
    'AMap.AutoComplete', // https://lbs.amap.com/api/javascript-api-v2/documentation#autocomplete
    'AMap.PlaceSearch', // https://lbs.amap.com/api/javascript-api-v2/documentation#placesearch
    'AMap.Geocoder', // https://lbs.amap.com/api/javascript-api-v2/documentation#geocoder
  ], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['AMap.Scale','...','...']
});

type CallbackStatus = 'complete' | 'error' | any;
type AMapCallback<R> = (status: CallbackStatus, result: R) => void;

export const aMapPromisify =
  <R, Args extends any[] = any>(
    fn: (...args: [...Args, AMapCallback<R>]) => void,
    thisArg?: any,
  ) =>
  (...args: Args): Promise<R> =>
    new Promise((resolve, reject) => {
      const callback = (status: CallbackStatus, result: R) => {
        if (status === 'error') {
          return reject(result);
        }
        return resolve(result);
      };
      fn.apply(thisArg, [...args, callback]);
    });

export default aMap;
