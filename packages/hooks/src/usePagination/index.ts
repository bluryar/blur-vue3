/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { ComputedRef, Ref, WritableComputedRef } from 'vue';
import type { Options as VueRequestOptions } from 'vue-request';
import { useRequest } from 'vue-request';
import type { PageDTO, PageVO } from './types';
import type { VueRequestReturn, Service } from './types';
import { ref, unref, computed, watch } from 'vue';
import { tryOnBeforeUnmount } from '@vueuse/core';
import type { Awaitable } from '@vueuse/core';

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

export const usePagination = <Params extends PageDTO, ItemVO>(
  service: Service,
  options: Options<Params, PageVO<ItemVO>> = { defaultCurrent: 1, defaultPageSize: 20 },
) => {
  const current = ref(options.defaultCurrent!);
  const size = ref(options.defaultPageSize!);
  const total = ref(0);
  const pages = ref(0);

  let __requestSource: 'onBefore' | 'onSuccess';
  const setCurrent = (val: number, from: 'onBefore' | 'onSuccess') => {
    current.value = val;
    __requestSource = from;
  };
  const setSize = (val: number, from: 'onBefore' | 'onSuccess') => {
    size.value = val;
    __requestSource = from;
  };
  const tryToExecute = (cb: () => Awaitable<void>) => {
    if (__requestSource === 'onBefore') {
      cb();
    }
  };
  const onChange = (current: number, size: number) => {
    setCurrent(current, 'onBefore');
    setSize(size, 'onBefore');
  };
  const changeCurrent = (current: number) => {
    setCurrent(current, 'onBefore');
  };
  const changePageSize = (size: number) => {
    setSize(size, 'onBefore');
  };
  const __service = (params?: Partial<Params>) => {
    __requestSource = 'onBefore';
    const res = service({
      ...params,
      page: {
        current: unref(current) - (mergedOptions.isSyncCurrent ? 0 : 1),
        size: unref(size),
      },
    });
    return res as Promise<PageVO<ItemVO>>;
  };

  const defaultParams: [params: Params] = [
    {
      page: {
        current: options.defaultCurrent!,
        size: options.defaultPageSize!,
      },
    } as Params,
  ];
  const mergedOptions: Options<Params, PageVO<ItemVO>> = {
    ...options,
    onSuccess(data, paramsList) {
      setCurrent((unref(data).current ?? 0) + (mergedOptions.isSyncCurrent ? 0 : 1), 'onSuccess');
      setSize(unref(data).size ?? 0, 'onSuccess');
      total.value = unref(data).total ?? 0;
      pages.value = unref(data).pages ?? 0;
      options?.onSuccess?.(data, paramsList);
    },
    defaultParams,
  };

  const response = useRequest(__service, mergedOptions) as UsePaginationReturns<Params, ItemVO>;
  const list = computed(() => unref(response.data)?.records ?? []);

  const stop = watch(
    [current, size],
    () => {
      tryToExecute(() => {
        response.run();
      });
    },
    { flush: 'post' },
  );

  tryOnBeforeUnmount(() => {
    stop();
  });

  response.pagination = {
    current,
    size,
    total,
    pages,
    list,
    onChange,
    changeCurrent,
    changePageSize,
    changePagination: onChange,
  };

  return response;
};
