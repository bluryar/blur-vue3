/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { ComputedRef, Ref, WritableComputedRef } from 'vue';
import type { Options as VueRequestOptions } from 'vue-request';
import { useRequest } from 'vue-request';
import type { PageDTO, PageVO } from './types';
import type { VueRequestReturn, Service } from './types';
import { ref, unref, computed, watch } from 'vue';

export interface Options<Params, ItemVO extends PageVO<any>> extends VueRequestOptions<ItemVO, [params?: Params]> {
  defaultParams?: [params?: Params];

  /**
   * 后端接口定义中, current是从0开始还是从1开始. 从1开始则为true
   *
   * @default false
   */
  isSyncCurrent?: boolean;

  /**
   * 默认的分页数量
   *
   * @default 20
   *  */
  defaultPageSize?: number;

  /**
   * 初次请求时的页数
   *
   * @default 1
   *  */
  defaultCurrent?: number;
}

export interface UsePaginationReturns<Params extends PageDTO, ItemVO>
  extends VueRequestReturn<PageVO<ItemVO>, [params?: Params]> {
  pagination: {
    /** 当前页码, 从1开始, 注意, 我们的后端接口定义是从0开始的, 因此我们需要在onBefore和onSuccess做一些操作 */
    current: Ref<number>;
    /** 每页显示条数 */
    size: Ref<number>;
    /** 总条数 */
    total: Ref<number>;
    /** 总页数 */
    pages: Ref<number>;
    /** 接口使用的页码, 注意是只读的 */
    currentForApi: ComputedRef<Readonly<number>>;
    /** 数据列表，省去每次都判断`unref(data)?.records` */
    list: ComputedRef<ItemVO[]>;
    onChange: (current: number, size: number) => void;
    /** @alias {@link pagination.onChange} */
    changePagination: (current: number, size: number) => void;
    /** 修改当前页数 */
    changeCurrent: (current: number) => void;
    /** 修改每页获取的条数 */
    changePageSize: (size: number) => void;
  };
}

const DEFAULT_CURRENT = 1;
const DEFAULT_SIZE = 20;

/**
 * 基于`useRequest`实现, 内部维护分页属性, 支持v-model发送请求. 与`useRequest`有以下不同点:
 *
 *    1. `service`只能接受一个参数.
 *
 *        经过实践: `service`定义多个入参的场景比较少, 可能的场景是: 位于不同http请求字段同名参数需要区分, 但是这样定义同名的参数我认为是徒增理解成本的.
 *
 *    2. `service`的请求参数需要实现这样分页字段: `{ page: { current:number; size:number;} }`
 *
 *    3. `service`返回的数据结构为: `{ current: number; size:number; total:number; pages:number; records: T[] }`, 通常, 你需要的是`records`, 这个字段在下面的`pagination`中
 *
 *    4. 扩展了`useRequest`的返回值, 多了一个`pagination字段`, 里边有可用于分页器的`current`\`size`\`total`等字段, 用于表格的`list`字段(`data.records`), `current`和`size`可以用于v-model进行绑定, 会触发请求.
 */
export const usePagination = <Params extends PageDTO, ItemVO>(
  service: Service,
  options: Options<Params, PageVO<ItemVO>> = { defaultCurrent: DEFAULT_CURRENT, defaultPageSize: DEFAULT_SIZE },
) => {
  const [
    defaultParams = {
      page: {
        current: options.defaultCurrent ?? DEFAULT_CURRENT,
        size: options.defaultPageSize ?? DEFAULT_SIZE,
      },
    } as Partial<Params>,
  ] = options.defaultParams ?? [];

  const current = ref(defaultParams.page?.current ?? DEFAULT_CURRENT);
  const size = ref(defaultParams.page?.size ?? DEFAULT_SIZE);
  const total = ref(0);
  const pages = ref(0);

  const currentForApi = computed(() => unref(current) - (mergedOptions.isSyncCurrent ? 0 : 1));

  const __setCurrent = (val: number) => {
    current.value = val;
  };
  const __setSize = (val: number) => {
    size.value = val;
  };
  const onChange = (current: number, size: number) => {
    __setCurrent(current);
    __setSize(size);
  };
  const changeCurrent = (current: number) => {
    __setCurrent(current);
  };
  const changePageSize = (size: number) => {
    __setSize(size);
  };

  // 构造代理的请求方法，不希望通过onBefore配置项去修改请求参数，以防错误的修改到响应式变量（这一点未验证，但是没啥必要去验证）
  const proxyRequestService = (innerParams?: Partial<Params>) => {
    const params: Params = {
      ...innerParams,
      page: {
        current: unref(currentForApi),
        size: unref(size),
      },
    } as Params;
    const res = service(params);
    return res as Promise<PageVO<ItemVO>>;
  };

  const mergedOptions: Options<Params, PageVO<ItemVO>> = {
    ...options,
    onSuccess(data, paramsList) {
      total.value = unref(data).total ?? 0;
      pages.value = unref(data).pages ?? 0;
      options?.onSuccess?.(data, paramsList);
    },
  };

  const response = useRequest(proxyRequestService, mergedOptions) as UsePaginationReturns<Params, ItemVO>;
  const list = computed(() => unref(response.data)?.records ?? []);

  watch(
    [current, size],
    () => {
      response.run();
    },
    { flush: 'pre' },
  );

  response.pagination = {
    current,
    size,
    total,
    pages,
    list,
    currentForApi,
    onChange,
    changeCurrent,
    changePageSize,
    changePagination: onChange,
  };

  return response;
};
