/**
 * @fileoverview 参考umi进行设计
 *
 * @see https://umijs.org/docs/max/request#request
 */

import type { AxiosError, AxiosRequestConfig, AxiosResponse, Method, AxiosInterceptorManager } from 'axios';
import type { useRequest } from 'vue-request';

type RequestError = AxiosError | Error;
interface IErrorHandler {
  (error: RequestError, opts: IRequestOptions): void;
}

enum ERROR_SHOW_TYPE {
  /** 不提示错误 */
  SILENT = 0,
  /** 警告信息提示, 默认使用该方式 */
  WARN_MESSAGE = 1,
  /** 错误信息提示 */
  ERROR_MESSAGE = 2,
  /** 通知提示 */
  NOTIFICATION = 4,
  /** 页面跳转 */
  REDIRECT = 9,
}

class BaseResponseVO<ResponseData = any, ErrorCodeType = any> {
  /** 请求是否成功 */
  success: boolean = true;

  /** 响应数据，成功时可以返回 */
  data?: ResponseData;

  /** 业务自定义错误码，业务复杂且默认提供的错误处理方案无法cover到时自定义 */
  errorCode?: ErrorCodeType;

  /** 错误信息 */
  errorMessage?: string;

  /** 错误信息的展现形式 */
  errorShowType?: ERROR_SHOW_TYPE = ERROR_SHOW_TYPE.WARN_MESSAGE;
}

/**
 * 扩展了`axios`的请求参数
 */
interface UmAxiosRequestConfig<T = BaseResponseVO> extends AxiosRequestConfig {
  errorConfig?: {
    /**
     * 异常处理方法，异常分别来自：
     * 1. 自定义异常(`errorThrower`)、
     * 2. axios设置的异常, 请求成功了并且服务器也响应的状态码, 但是状态码超出了2xx的范围
     * 3. 请求已经成功发起，但没有收到响应， 可以认为是请求超时了
     * 4. 兜底， 其他更加少见的异常
     */
    errorHandler?: IErrorHandler;
    /**
     * 这里抛出自制的异常，一般来说你需要设置一个自定义的异常，然后在上面的`errorHandler`进行处理。
     */
    errorThrower?: (res: T) => void;
  };
}

type UseRequestReturns<Response, Params extends unknown[]> = ReturnType<typeof useRequest<Response, Params>>;

function getConfig() {}

function defineConfig() {}

/**
 * 请求配置项，比axios多了几个参数，运行进行更加灵活的配置
 */
interface IRequestOptions extends AxiosRequestConfig {
  /**
   * 当某个请求希望跳过错误处理拦截器时，置为`true`
   *
   * @default false
   */
  skipErrorHandler?: boolean;

  /**
   * 当某个请求希望直接拿到接口返回的数据结构而非默认取`response.data`时，置为`true`
   *
   * @default false
   */
  getResponse?: boolean;

  /**
   * 请求拦截器，只针对当前请求，在默认配置的请求拦截器之后被调用
   */
  requestInterceptors?: AxiosInterceptorManager<UmAxiosRequestConfig>[];

  /**
   * 响应拦截器，只针对当前请求，在默认配置的响应拦截器之后被调用
   */
  responseInterceptors?: AxiosInterceptorManager<AxiosResponse<BaseResponseVO>>[];
}

function request() {}

export { ERROR_SHOW_TYPE, BaseResponseVO };

export type { UmAxiosRequestConfig, UseRequestReturns };
