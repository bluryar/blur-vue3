/**
 * @desc 类型判断工具类
 */

/** 占位符，参数需要传入回调函数时用来做默认值 */
export const NOOP = () => {};
export const EMPTY_OBJECT: { readonly [key: keyof any]: any } = {};
export const EMPTY_ARRAY = [];

export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);
export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1);
};

export function isNumber(data: unknown): data is number {
  return toRawType(data) === 'Number';
}
export function isBoolean(data: unknown): data is boolean {
  return toRawType(data) === 'Boolean';
}
export function isNull(data: unknown): data is null {
  return toRawType(data) === 'Null';
}
export function isUndefined(data: unknown): data is undefined {
  return toRawType(data) === 'Undefined';
}
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol';
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object';
export const isFunction = (val: unknown): val is Function => typeof val === 'function';

export function isArray(data: unknown): data is Array<any> {
  return toRawType(data) === 'Array';
}
export function isDate(data: unknown): data is Date {
  return toRawType(data) === 'Date';
}
export function isRegExp(data: unknown): data is RegExp {
  return toRawType(data) === 'RegExp';
}
export function isSet(data: unknown): data is Set<any> {
  return toRawType(data) === 'Set';
}
export function isMap(data: unknown): data is Map<any, any> {
  return toRawType(data) === 'Map';
}
export function isFile(data: unknown): data is File {
  return toRawType(data) === 'File';
}
export function isElement(data: unknown): data is HTMLElement {
  return /HTML(.*)?Element/.test(toRawType(data));
}
/** @deprecated @see use `document.documentElement` or `isElement` instead */
export function isDocument(data: unknown): data is HTMLDocument {
  return /HTML(.*)?Element/.test(toRawType(data));
}
export const isWindow = (val: any): val is Window => typeof window !== 'undefined' && toRawType(val) === 'Window';

export const isNil = (data: unknown): data is undefined | null => isUndefined(data) || isNull(data);
/** @alias isNil */
export const isNullable = isNil;
/** 与isUndefined相反 */
export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined';

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

export const isIntegerKey = (key: unknown) =>
  isString(key) && key !== 'NaN' && key[0] !== '-' && String(parseInt(key, 10)) === key;

export const toNumber = (val: any): any => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};

export function promiseTimeout(ms: number, throwOnTimeout = false, reason = 'Timeout'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout) setTimeout(() => reject(reason), ms);
    else setTimeout(resolve, ms);
  });
}

export const sleep = (ms: number) => {
  return promiseTimeout(ms, !!0);
};

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
export const now = () => Date.now();
export const timestamp = () => Number(Date.now());
export const rand = (min: number, max: number) => {
  let _min = Math.ceil(min);
  let _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min + 1)) + _min;
};

export const assert = (condition: boolean, ...infos: any[]) => {
  if (!condition) console.warn(...infos);
};
export const isClient = typeof window !== 'undefined';
export const isIOS =
  /* #__PURE__ */ isClient && window?.navigator?.userAgent && /iP(ad|hone|od)/.test(window.navigator.userAgent);
