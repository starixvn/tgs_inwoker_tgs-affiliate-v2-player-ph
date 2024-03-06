import request from '@/utils/request';

interface Localization {
  [key: string]: string;
}

export interface LocalizationResult extends BaseResult {
  data: Localization;
}

interface FeatureResult {
  [key: string]: string;
}

interface Livechat {
  name: string;
  setting: { url: string };
}

export interface LivechatResult extends BaseResult {
  data: Livechat;
}

export function getLocalization<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<LocalizationResult, [], T>(
    () => ({
      url: 'localization',
      method: 'get',
    }),
    { needAll: true },
    returnAxios,
  );
}

export function getFeatures<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<FeatureResult, [], T>(
    () => ({
      url: 'https://app12.srvptt.com/features_' + process.env.BRAND + '.json',
      method: 'get',
    }),
    { needAll: true },
    returnAxios,
  );
}

export function getLiveChat<T extends boolean = true>(returnAxios: T = true as T, noLoading = false) {
  return request<LivechatResult, [], T>(
    () => ({
      url: 'brandlivechat',
      method: 'get',
    }),
    { needAll: true },
    returnAxios,
  );
}
