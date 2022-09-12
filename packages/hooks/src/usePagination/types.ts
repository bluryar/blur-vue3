import type { useRequest } from 'vue-request';

export type VueRequestReturn<R, P extends unknown[] = any> = ReturnType<typeof useRequest<R, P>>;

export class Order {
  /** 是否升序(默认是true) */
  asc?: boolean;

  /** 排序字段 */
  column?: string;
}

export class PageDTO {
  page?: {
    /** 当前页(从0开始,默认0) */
    current?: number;

    /** 每页大小(默认20,最大10000) */
    size?: number;
  };
}

export class PageVO<T = any> {
  /** 当前页码, 从0开始 */
  current?: number;

  /** 分页排序参数 */
  orders?: Array<Order>;

  /** 总页数 */
  pages?: number;

  /** 数据结果集 */
  records?: Array<T>;

  /** 每页显示条数 */
  size?: number;

  /** 总条数 */
  total?: number;
}

export type Service = <Params extends PageDTO, Response>(parmas?: Params) => Promise<PageVO<Response>>;
