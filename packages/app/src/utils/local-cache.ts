import { isNil } from 'lodash-es';
import { LocalStorage } from 'quasar';

interface CacheData<T = any> {
  expiredAt?: Date;
  value?: T;
}

class LocalCache {
  static namespace = 'honor-calendar';

  static get keys() {
    return {
      schedule: 'schedule',
    } as const;
  }

  static genKey(key: string) {
    return `${LocalCache.namespace}:${key}`;
  }

  static removeItem(key: string) {
    return LocalStorage.remove(LocalCache.genKey(key));
  }

  static setItem(key: string, value: any, expiredAt?: Date) {
    if (isNil(value)) {
      LocalCache.removeItem(LocalCache.genKey(key));
      return;
    }
    const data = {
      expiredAt,
      value,
    };
    LocalStorage.set(LocalCache.genKey(key), data);
  }

  static getItem<T>(key: string, defaultValue?: T) {
    const data: CacheData<T> = LocalStorage.getItem(LocalCache.genKey(key)) ?? {
      value: defaultValue,
    };
    // 过期
    if (data?.expiredAt && Date.now() > data.expiredAt.getTime()) {
      return defaultValue;
    }
    return data?.value ?? defaultValue;
  }
}

export default LocalCache;
