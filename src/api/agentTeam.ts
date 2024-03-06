import { request } from '@/utils/request';
interface TeamInfoResult extends BaseResult {
  data: InfoData;
}
export interface GetTeamInfoParams {}
export interface InfoData {
  directAgentCount: number;
  directPlayerCount: number;
  indirectAgentCount: number;
  indirectPlayerCount: number;
}

export function getInfoApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = true) {
  return request<TeamInfoResult, [], T>(
    () => ({
      url: 'agentTeam/info',
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}
