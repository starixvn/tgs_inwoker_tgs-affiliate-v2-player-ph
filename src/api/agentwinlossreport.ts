import { request, RequestOptions } from '@/utils/request';

export interface AgentWinlossReportParams extends BasePageParams {
  username : string;
  memberType: string;
  downLine: boolean;
  from : string;
  to: string;
}
export interface AgentWinlossReportResult extends BaseResult {
  data: {
    items: [WinlossReportItem];
    total: WinlossReportBaseData;
    totalCount: number;
    errors: [];
    message: string;
    valid: boolean;
  };
}
export interface WinlossReportBaseData {
  visible: boolean;
  roundCount: number;
  turnover: number;
  winLoss: number;
  agentWinLoss: number;
  companyWinLoss: number;
  special: number;
  agentSpecial: number;
  companySpecial: number;
  agentTotal: number;
  companyTotal: number;
}
export interface WinlossReportItem extends WinlossReportBaseData {
  id: string;
  username: string;
  memberType: string;
}
export class AgentPlayerSpecialDetailParams {
  agentId = '';
  from = '';
  to = '';
}
export interface AgentPlayerSpecialDetailResult extends BaseResult {
  data: AgentPlayerSpecialDetailData;
}
export interface AgentPlayerSpecialDetailData {
  bonus: number;
  bonusAdjust: number;
  productFee: number;
}

export class AgentTotalDetailParams {
  agentId = '';
  from = '';
  to = '';
}
export interface AgentTotalDetailResult extends BaseResult {
  data: [AgentTotalDetailData];
}
export interface AgentTotalDetailData {
  from: string;
  to: string;
  percentage: number;
  playerWinLoss: number;
  playerSpecial: number;
  agentWinLoss: number;
  agentSpecial: number;
  agentTotal: number;
}

export class CompanyTotalDetailParams extends AgentTotalDetailParams {}
export interface CompanyTotalDetailResult extends BaseResult {
  data: [CompanyTotalDetailData];
}
export interface CompanyTotalDetailData {
  from: string;
  to: string;
  percentage: number;
  playerWinLoss: number;
  playerSpecial: number;
  companyWinLoss: number;
  companySpecial: number;
  companyTotal: number;
}

export interface RoundsParams extends BasePageParams {
[x: string]: any;
  playerCode: string;
  closedFrom : string;
  closedTo : string;
}
export interface RoundsResult extends BaseResult {
  data: {
    items: [RoundsData];
    total: RoundsTotalData;
    totalCount: number;
    errors: [];
    message: string;
    valid: boolean;
  };
}
export interface RoundsData extends RoundsTotalData{

  closedOn: string;
  createdOn: string;
  externalRoundId: string;
  gameName: string;
  gameProviderName: string;
  id: string;
  playerCode: string;
  playerName: string;

  status: number;
  subGameProviderName: string;
  turnover: number;

}
export interface RoundsTotalData {
  betAmount: number;
  settleAmount: number;
  validBetAmount: number;
  winLoss: number;
}
export interface ExportResult {

}

export interface BreadcrumbParams{
  username: string;
  memberType: string;
  roundId: string;
}
export interface BreadcrumbResult{
  data:BreadcrumbData[]
}
export interface BreadcrumbData{
  username: string;
  memberType: string;
  id: string;
}
export function agentWinlossReportApi(
  options: RequestOptions<AgentWinlossReportResult, [AgentWinlossReportParams]> = {},
) {
  return request(
    (params) => ({
      url: 'agentwinlossreport/agentWinLoss',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false }, options),
  );
}

export function agentPlayerSpecialDetailApi(
  options: RequestOptions<AgentPlayerSpecialDetailResult, [AgentPlayerSpecialDetailParams]> = {},
) {
  return request(
    (params) => ({
      url: 'agentwinlossreport/agentPlayerSpecialDetail',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: true }, options),
  );
}

export function agentTotalDetailApi(options: RequestOptions<AgentTotalDetailResult, [AgentTotalDetailParams]> = {}) {
  return request(
    (params) => ({
      url: 'agentwinlossreport/agentTotalDetail',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: true }, options),
  );
}
export function companyTotalDetailApi(
  options: RequestOptions<CompanyTotalDetailResult, [CompanyTotalDetailParams]> = {},
) {
  return request(
    (params) => ({
      url: 'agentwinlossreport/companyTotalDetail',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: true }, options),
  );
}


export function roundsApi(
  options: RequestOptions<RoundsResult, [RoundsParams]> = {},
) {
  return request(
    (params) => ({
      url: 'agentwinlossreport/rounds',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false }, options),
  );
}



export function exportAgentWinLossApi(
  options: RequestOptions<any, [AgentWinlossReportParams]> = {},
) {
  return request(
    (params) => ({
      url: 'agentwinlossreport/exportAgentWinLoss',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false ,needAll: true,isFile:true }, options),
  );
}

export function exportRoundsApi(
  options: RequestOptions<any, [RoundsParams]> = {},
) {
  return request(
    (params) => ({
      url: 'agentwinlossreport/exportRounds',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false,needAll: true,isFile:true  }, options),
  );
}


export function breadcrumbApi(
  options: RequestOptions<BreadcrumbResult, [BreadcrumbParams]> = {},
) {
  return request(
    (params) => ({
      url: 'agentwinlossreport/breadcrumb',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: true }, options),
  );
}
