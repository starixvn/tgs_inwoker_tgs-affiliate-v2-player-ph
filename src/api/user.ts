import request from '@/utils/request';

const enum Api {
  LOGIN = 'agent/login',
  USER_INFO = 'agent/info',
}

// 登录
export class LoginParams {
  username = '';
  password = '';
  phone = '';
  email = '';
  platformtype = 1;
}
export interface LoginResult {
  err: number;
  errmsg: string;
  errmsgid: any;
  logintime: number;
  token: string;
}

export function loginApi<T extends boolean = true>(returnAxios: T = true as T) {
  return request<LoginResult, [LoginParams], T>(
    (params) => ({
      url: Api.LOGIN,
      method: 'post',
      data: params,
    }),
    { needAll: true },
    returnAxios,
  );
}

export interface IUserInfoData extends BaseResult {
  accumulatedprofitsharing: number;
  agentdividendtype: string;
  agentdomains: string[];
  agentlevel: number;
  balance: number;
  brandUrl: string;
  dividendconditions: any[];
  dividendpercentage: number;
  email: string;
  id: string;
  invitationCode: string;
  issetpaypassword: boolean;
  leveltype: string;
  parentusername: string;
  phone: string;
  playernumber: number;
  qq: string;
  realname: string;
  registeredon: string;
  status: string;
  type: string;
  username: string;
  wechat: string;
}

interface IUserInfoResult extends BaseResult {
  data: IUserInfoData;
}

export function userInfoApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = true) {
  return request<IUserInfoResult, [], T>(
    () => ({
      url: Api.USER_INFO,
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}
