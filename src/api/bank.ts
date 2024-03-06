import request from '@/utils/request';

const enum Api {
  BANK_INFO = 'bankinfo',
  WITHDRAWAL = 'withdraw',
}
export interface IBankInfoDataDetails {
  bankAccount: string;
  bankBranch: string;
  bankName: string;
  name: string;
  address: string;
}
export interface IBankInfoData {
  banktype: string;
  id: string;
  paymentchannelid: string;
  detail: IBankInfoDataDetails;
}

interface IBankInfoResult extends BaseResult {
  data: IBankInfoData[];
}
export class DeleteCardParams {
  id = '';
}
export class WithdrawalParams {
  amount = 0;
  bankinfoid = '';
  paypassword = '';
}
export class AddCardDetailParams {
  address = '';
  bankAccount = '';
  bankBranch = '';
  bankName = '';
  name = '';
}
export class AddCardParams {
  banktype = '';
  paymentchannelid = '';
  detail = new AddCardDetailParams();
}
interface IDeleteCardResult extends BaseResult {
  data: string;
}
interface IAddCardResult extends BaseResult {
  data: string;
}
interface IWithdrawalResult extends BaseResult {
  data: string;
}
interface ITransferLimit extends BaseResult {
  from: number;
  to: number;
}
export interface IAddCardInfoData {
  banktype: string;
  id: string;
  channelcode: string;
  channelid: string;
  channelname: string;
  extended: ITransferLimit;
  methodcode: string;
  methodid: string;
  paymentcode: string;
  paymentid: string;
  transferlimit: ITransferLimit;
}
interface IAddCardInfoResult extends BaseResult {
  data: IAddCardInfoData[];
}
export function bankInfoApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = false) {
  return request<IBankInfoResult, [], T>(
    () => ({
      url: Api.BANK_INFO,
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}
export function withdrawalApi<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<IWithdrawalResult, [WithdrawalParams], T>(
    (params) => ({
      url: Api.WITHDRAWAL,
      method: 'post',
      data: params,
    }),
    { needAll: true },
    returnAxios,
  );
}
export function addCardInfoApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = false) {
  return request<IAddCardInfoResult, [], T>(
    () => ({
      url: Api.WITHDRAWAL,
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}
export function addCardApi<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<IAddCardResult, [AddCardParams], T>(
    (params) => ({
      url: Api.BANK_INFO,
      method: 'post',
      data: params,
    }),
    { needAll: true },
    returnAxios,
  );
}
export function deleteCardApi<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<IDeleteCardResult, [string], T>(
    (params) => ({
      url: Api.BANK_INFO + '/' + params,
      method: 'delete',
      data: params,
    }),
    { needAll: true },
    returnAxios,
  );
}
