import { closeLoading, loading } from '@/utils/loading';
import { useUserStore, useGlobalStore } from '@/store';
import axios, { AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import log from './log';
import { useRequest, Options, setGlobalOptions } from 'vue-request';
import { localeConfig } from '@/config';
import qs from 'qs';
const t = (...args: [string | number]) => useGlobalStore().i18n.t(...args);

function matchErrorType(errorType: string) {
  return useGlobalStore().localization[errorType];
}

const service = axios.create({
  baseURL: process.env.API_URL + 'api/', // url = base url + request url
  timeout: 10000, // request timeout
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true }), // 数组query参数转换为repeat a=1&a=2,null值会被删除
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做一些事情
    if (!config.headers) {
      config.headers = {};
    }

    const userStore = useUserStore();
    if (userStore.token) {
      config.headers['token'] = userStore.token;
    }
    if (config.url!.indexOf("export") >= 0) {
      config.responseType = 'blob';

    }
    config.headers['accept-language'] =
      localStorage.getItem('me-config-locale') ?? localeConfig.localeSetting.locale ?? 'tgl-ph';
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    log.error(error); // for debug
    throw Error(t('请求异常，请联系管理员')); // 改写错误信息
  },
);
service.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log(error.response.data.err);
    if (error.response.data.err === 900 && error.response.data.errmsg == 'Agent login token is expired') {
      useUserStore().logOut();
    }
    log.error(error); // for debug

    //match error.response.data.errmsgid with data in globalstore localization
    ElMessage.error({
      message: matchErrorType(error.response.data.errmsgid),
    });
    return error.response;
    // 改写错误信息
  },
);

export type RequestOptions<R, P extends unknown[]> = {
  needAll?: boolean; // 需要所有的格式，而不仅仅是data
  noLoading?: boolean; // 不需要加载特效
  noError?: boolean; // 不需要错误提示
  success?: boolean; //成功后提示
  isFile?: boolean;
} & Options<R, P>;

setGlobalOptions({
  manual: true, // 请求需要手动调用
  // ...
});

// 请求函数，当请求失败时直接抛出异常;
export function request<R, P extends unknown[] = []>(
  axiosConfig: (...args: P) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
  options?: RequestOptions<R, P>,
): ReturnType<typeof useRequest<R, P>>;
export function request<R, P extends unknown[] = [], T extends boolean = boolean>(
  axiosConfig: (...args: P) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
  options: RequestOptions<R, P>,
  returnAxios: T,
): T extends true ? (...args: P) => Promise<R> : ReturnType<typeof useRequest<R, P>>;
/**
 * 请求函数
 * @param axiosConfig  axios的配置项
 * @param options vue request配置项+自定义配置项参考 RequestOptions
 * @param returnAxios
 * @returns
 */
export function request<R, P extends unknown[] = [], T = boolean>(
  axiosConfig: (...args: P) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
  options?: RequestOptions<R, P>,
  returnAxios?: T,
) {
  const axiosService = async (...args: P): Promise<R> => {
    //loading放到微任务中去执行以确保在自动调用请求时等待所有的宏任务中的生命周期函数执行完再创建loading实例 以规避currentInstance的相关警告

    try {
      !options?.noLoading && Promise.resolve(undefined).then(loading);
      const { data: res } = await service(await axiosConfig(...args));

      if (res.agent !== undefined) {
        closeLoading();
        return res;
      }

      // if (!options?.isFile && (!res || res.err === undefined)) {
      //   throw Error(t('返回值解析失败'));
      // }

      // 401：认证失败
      if (res.err === 900 && res.errmsg == 'Agent login token is expired') {
        await useUserStore().logOut();
        return res;
      }

      if (res.err !== 0) {
        !options?.noLoading && closeLoading();
        // throw Error(res.errmsg);
      }

      if (options?.success) {
        ElMessage.success({ message: res.errmsg });
      }

      closeLoading();
      return options?.needAll ? res : res;
    } catch (e) {
      !options?.noLoading && closeLoading();
      throw e;
    }
  };

  return returnAxios ? axiosService : useRequest<R, P>(axiosService, options);
}

export default request;
