import { request, RequestOptions } from '@/utils/request';
export class AddPlayerParams {
  username = '';
  password = '';
  confirmPassword = '';
  areaCode = '+84';
  phone = '';
  email = '';
  tnc = false;
}
export interface AddPlayerResult extends BaseResult {
  data: string;
}

export class AddPlayerPhoneParams {
  areaCode = '';
  phone = '';
  playercode = '';
}

export class AddPlayerEmailParams {
  email = '';
  playercode = '';
}

export interface PlayerData {
  areacode: string;
  phone: string;
  playercode: string;
  registeredtime: string;
  registerhost: string;
  lastloginon: string;
  totaldepositamount: number;
  totalwithdrawamount: number;
  status: number;
  username: string;
  viplevel: number;
}
interface PlayeListResult extends BaseResult {
  data: {
    items: PlayerData[];
    totalcount: number;
  };
}
interface PlayerStatusResult {
  data: PlayerStatusData;
}
export interface PlayerStatusData {
  [key: string | number]: string;
}
export interface GetPlayerListParams extends BasePageParams {
  BeginRegisteredOn: string;
  EndRegisteredOn: string;
  RegisterHost: string;
  Status: string;
  Username: string;
  VipId: string;
}
export interface PlayerBalanceResult {
  data: number;
}
export class CheckConditionParams {
  data = {
    email: '',
    areacode: '',
    phone: '',
  };
  username = '';
}
export interface CheckConditionResult {
  data: boolean;
}
export function checkConditionApi<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<CheckConditionResult, [CheckConditionParams], T>(
    (params) => ({
      url: 'player/check/registrationconditions',
      method: 'post',
      data: params,
    }),
    { needAll: true },
    returnAxios,
  );
}
export function addPlayerApi<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<AddPlayerResult, [AddPlayerParams], T>(
    (params) => ({
      url: 'player/create',
      method: 'post',
      data: params,
    }),
    { needAll: true },
    returnAxios,
  );
}
export function addPlayerPhoneApi<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<BaseResult, [AddPlayerPhoneParams], T>(
    (params) => ({
      url: 'player/phone',
      method: 'put',
      data: params,
    }),
    { needAll: true },
    returnAxios,
  );
}


export function addPlayerEmailApi<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<BaseResult, [AddPlayerEmailParams], T>(
    (params) => ({
      url: 'player/email',
      method: 'put',
      data: params,
    }),
    { needAll: true },
    returnAxios,
  );
}
export function getPlayerList(options: RequestOptions<PlayeListResult, [GetPlayerListParams]> = {}) {
  return request(
    (params) => ({
      url: 'player/list',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false }, options),
  );
}
export function getPlayerStatuses<T extends boolean = false>(returnAxios: T = false as T, noLoading = false) {
  return request<PlayerStatusResult, [], T>(
    () => ({
      url: 'player/list/statuses',
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}
export function getPlayerBalanceApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = true) {
  return request<PlayerBalanceResult, [string], T>(
    (param) => ({
      url: 'player/balance/' + param,
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}
export function getPlayerWageringApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = true) {
  return request<PlayerBalanceResult, [string], T>(
    (param) => ({
      url: 'player/withdraw/amount/' + param,
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}
