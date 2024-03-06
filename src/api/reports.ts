import { request, RequestOptions } from '@/utils/request';

export interface AgentStatusesResult extends BaseResult {
  data: AgentStatusesData;
}

export interface AgentStatusesData {
  [key: string]: string;
}
export interface AgentDetailsResult extends BaseResult {
  data: AgentDetailsData;
}

export interface AgentData {
  agentstatus: string;
  balance: number;
  cardgamerebatepercentage: number;
  commissionpercentage: number;
  dividendpercentage: number;
  id: string;
  leveltype: string;
  livedealerrebatepercentage: number;
  lotteryrebatepercentage: number;
  registeredon: string;
  slotrebatepercentage: number;
  sportsrebatepercentage: number;
  status: string;
  teamnumber: 1;
  type: string;
  username: string;
  virtualsportsrebatepercentage: number;
}
export interface AgentDetailsData extends AgentData {
  accumulatedprofitsharing: number;
  agentdividendtype: string;
  agentdomains: string;
  agentlevel: number;
  brandUrl: string;
  dividendconditions: string;
  email: string;
  invitationCode: string;
  issetpaypassword: boolean;
  parentusername: string;
  phone: string;
  playernumber: number;
  qq: string;
  realname: string;
  wechat: string;
}
interface AgentListResult extends BaseResult {
  data: {
    items: AgentData[];
    totalCount: number;
    valid: boolean;
    message: string;
  };
}

export interface GetAgentListParams extends BasePageParams {
  Status: string;
  Username: string;
}

export function getAgentList(options: RequestOptions<AgentListResult, [GetAgentListParams]> = {}) {
  return request(
    (params) => ({
      url: 'agent/list',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false }, options),
  );
}
export function getAgentStatusesApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = false) {
  return request<AgentStatusesResult, [], T>(
    () => ({
      url: 'agent/list/statuses',
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}

export function getAgentDetailsApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = false) {
  return request<AgentDetailsResult, [string], T>(
    (params) => ({
      url: 'agent/info/' + params,
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}
