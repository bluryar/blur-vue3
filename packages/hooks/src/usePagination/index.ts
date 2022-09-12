import type { Ref } from 'vue';
import type { Options as VueRequestOptions } from 'vue-request';
import { useRequest } from 'vue-request';
import { PageDTO, PageVO } from './types';
import type { VueRequestReturn, Service } from './types';

export interface Options<Params, Response extends PageVO<any>> extends VueRequestOptions<Response, [params?: Params]> {
  /**
   * 默认的分页数量
   *
   * @default 20
   *  */
  defaultPageSize: number;

  /**
   * 初次请求时的页数
   *
   * @default 0
   *  */
  defaultCurrent: number;
}

export interface UsePaginationReturns<Params extends PageDTO, Response extends PageVO<any>>
  extends VueRequestReturn<Response, [params?: Params]> {
  pagination: {
    /** 当前页码, 从0开始 */
    current: Ref<number>;
    /** 每页显示条数 */
    size: Ref<number>;
    /** 总条数 */
    total: Ref<number>;
    /** 总页数 */
    pages: Ref<number>;
    onChange: (current: number, size: number) => void;
    /** 修改当前页数 */
    changeCurrent: (current: number) => void;
    /** 修改每页获取的条数 */
    changePageSize: (size: number) => void;
    /** changePagination */
    changePagination: (size: number) => void;
  };
}

export const usePagination = <Params, Response>(
  service: Service,
  options: Options<Params, PageVO<Response>> = { defaultCurrent: 0, defaultPageSize: 20 },
) => {
  const pageVO = new PageVO();
  const pageDTO = new PageDTO();
  // pageDTO.page?.current;
  const mergedOptions: Options<Params, PageVO<Response>> = {
    ...options,
    // defaultParams: [pageDTO],
  };
  // const response = useRequest(service, options);

  const pagination = {};

  // return response;
};
