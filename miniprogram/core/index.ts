// 下一级对象保存上一级对象引用
const parentSymbol = Symbol.for('__parent__');
const dataRef = 'data';
// 第一个参数类型
export interface ThisArg extends Object {
  [key: string | symbol]: any;
  data: { [key: string | symbol]: unknown };
}
/**
 * 判断是否为一个对象
 * @param target 对象
 * @returns
 */
function isObject(target: any) {
  // undefined、null
  if (!target) {
    return false;
  }
  return typeof target === 'object' && !isArray(target);
}
/**
 * 是否为一个数组
 * @param target 对象
 * @returns
 */
function isArray(target: any) {
  // undefined、null
  if (!target) {
    return false;
  }
  return target instanceof Array;
}

/**
 *
 * @param proxy 获取root对象
 * @returns
 */
function _getParent<T extends object>(proxy: T): T {
  if (!Reflect.has(proxy, parentSymbol)) {
    return proxy;
  }
  return _getParent(Reflect.get(proxy, parentSymbol));
}
/**
 * 进行响应式处理
 * @param thisArg
 * @param proxy
 */
function _handleReactive<T extends object>(thisArg: ThisArg, proxy: T, oldValue: T) {
  proxy = _getParent(proxy);
  const data = Reflect.get(thisArg, dataRef);
  const keys: (symbol | string)[] = Reflect.ownKeys(data).filter((key) => Reflect.get(data, key) === proxy);
  keys.forEach((propertyKey) => {
    (thisArg as any).setData({
      [propertyKey]: proxy
    });
  });
}

/**
 * 对对象进行代理
 * @param target 对象
 * @returns
 */

function _reactive<T extends object>(thisArg: ThisArg, target: T, parent?: T): T {
  // 子对象记录父对象地址
  if (!Reflect.has(target, parentSymbol) && parent) {
    Reflect.defineProperty(target, parentSymbol, {
      enumerable: true,
      configurable: true,
      value: parent
    });
  }
  const targetProxy = new Proxy(target, {
    get(target, propertyKey, receiver) {
      const result = Reflect.get(target, propertyKey, receiver);
      // 如果获取的是个对象或数组，则进行响应式代理
      if ((isObject(result) || isArray(result)) && !Reflect.has(result, parentSymbol) && propertyKey !== parentSymbol) {
        Reflect.set(target, propertyKey, _reactive<T>(thisArg, result, targetProxy));
      }
      return result;
    },
    set(target, propertyKey, value, receiver) {
      const result = Reflect.set(target, propertyKey, value, receiver);
      // 如果是数组的增加或删除，当设置length属性的时候才通知
      if (result && target instanceof Array && propertyKey === 'length') {
        _handleReactive<T>(thisArg, receiver, targetProxy);
      } else if (result && !(target instanceof Array)) {
        // 不是数组的时候直接通知
        _handleReactive<T>(thisArg, receiver, targetProxy);
      }
      return result;
    },
    defineProperty(target, propertyKey, attributes) {
      return Reflect.defineProperty(target, propertyKey, attributes);
    },
    deleteProperty(target, propertyKey) {
      const result = Reflect.deleteProperty(target, propertyKey);
      // 不是数组且不是targetSymbol才派发通知
      if (result && !(target instanceof Array)) {
        // 查找目标对象上是否有值是当前代理对象的，如果有重新复制，以便进行页面刷新
        _handleReactive<T>(thisArg, targetProxy, targetProxy);
      }
      return result;
    }
  });
  return targetProxy;
}
/**
 * 对象响应式处理
 * @param thisArg 当前页面或组件对象，固定传this
 * @param target 对象
 * @returns 代理实例
 */
export function reactive<T extends object>(thisArg: ThisArg, target: T): T {
  if (typeof thisArg !== 'object' || thisArg === null) {
    throw new Error(`thisArg必须为页面或组件this对象`);
  }
  if (typeof target !== 'object' || target === null) {
    throw new Error(`target必须是一个对象或数组`);
  }
  return _reactive<T>(thisArg, target);
}
/**
 * 初始化
 * @param thisArg 当前页面或组件对象，固定传this
 */
export function initReactive(thisArg: ThisArg) {
  if (Reflect.has(thisArg, dataRef)) {
    Reflect.ownKeys(Reflect.get(thisArg, dataRef)).forEach((key) => {
      // 删除原有存在在当前实例的属性，重新定义以便于拦截
      if (Reflect.has(thisArg, key)) {
        Reflect.deleteProperty(thisArg, key);
      }
      // 判断是否key包含在properties中
      Reflect.defineProperty(thisArg, key, {
        get() {
          return Reflect.get(Reflect.get(thisArg, dataRef), key);
        },
        set(value) {
          const oldValue = Reflect.get(Reflect.get(thisArg, dataRef), key);
          // 新旧值一致，不做修改
          if (value === oldValue) {
            return;
          }
          thisArg.setData({
            [key]: value
          });
        }
      });
    });
  }
}
