import { request, RequestOptions } from '@/utils/request';

interface ISubitems {
  agentAdjustAmount: number;
  agentCoveredBonus: number;
  agentCoveredBonusAdjust: number;
  agentDividendAmount?: number;
  agentDividendPercentage: number;
  betAmount: number;
  bonusAdjustAmount: number;
  bonusAmount: number;
  fromPlayerAgentDividendAmount: number;
  fromTeamAgentDividendAmount: number;
  id: string;
  netProfit: number;
  turnover: number;
  username: string;
  validBetAmount: number;
  winLossAmount: number;
}
interface IResult extends BaseResult {
  data: {
    mainitems: ISubitems[];
    subitems: ISubitems[];
    subtotal: ISubitems;
    subtotalcount: number;
  };
}

interface ContributeSubitems {
  agentAdjustAmount: number;
  betAmount: number;
  bonusAdjustAmount: number;
  bonusAmount: number;
  companyAdjustAmount: number;
  depositAmount: number;
  depositHandlingFee: number;
  netProfit: number;
  turnover: number;
  type: number;
  username: string;
  validBetAmount: number;
  winLossAmount: number;
  withdrawalAmount: number;
}

interface RoundSubItems {
  additionalData: string;
  betAmount: number;
  closedOn: string;
  commission: any;
  createdOn: string;
  currencyCode: string;
  externalClosedOn: string;
  externalCreatedOn: string;
  externalPlayerCode: string;
  externalRoundId: string;
  gameId: number;
  gameName: string;
  gameProviderCode: string;
  gameProviderId: string;
  gameProviderName: string;
  id: string;
  platformType: number;
  playerCode: string;
  playerName: string;
  settleAmount: number;
  status: number;
  subGameProviderName: string;
  tieBetAdjustment: any;
  turnover: number;
  updatedOn: string;
  validBetAmount: number;
  winLoss: number;
}

interface ContributeResult extends BaseResult {
  data: {
    items: ContributeSubitems[];
    total: ContributeSubitems;
    totalcount: number;
  };
}

export interface GameProviderResult extends BaseResult {
  data: {
    id: string;
    name: string;
  };
}
export interface AccountChangesParams extends BasePageParams {
  transactiontype: string;
  id: string;
  From: string;
  To: string;
  dateRange: [Date, Date];
}
export interface AgentDividendsParams extends BasePageParams {
  From: string;
  To: string;
}
export interface AgentContributeParams extends BasePageParams {
  From: string;
  To: string;
}
export interface AccountChangesItems {
  amount: number;
  balance: number;
  recordedOn: string;
  transactionId: string;
  transactionType: number;
}
interface AccountChangesResult extends BaseResult {
  data: {
    items: AccountChangesItems[];
    totalcount: number;
  };
}

interface RoundReportResult extends BaseResult {
  data: {
    items: RoundSubItems[];
    totalcount: number;
  };
}
export interface TransactionTypeResult extends BaseResult {
  data: TransactionTypeData;
}
export interface TransactionTypeData {
  [key: string]: string;
}

export interface RoundReportStatus extends BaseResult {
  data: RoundReportStatusData;
}

export interface RoundReportStatusData {
  [key: string]: string;
}

interface DividendDetailsItems {
  agentDividendAmount: number;
  expenditureAmount: number;
  id: string;
  settlementDate: string;
  settlementDateFrom: string;
  settlementDateTo: string;
  username: string;
}

interface DividendDetailsResult extends BaseResult {
  data: {
    items: DividendDetailsItems[];
    totalcount: number;
  };
}

export function agentDividends(options: RequestOptions<IResult, [AgentDividendsParams]> = {}) {
  return request(
    (params) => ({
      url: 'agentreport/agentdividends',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false }, options),
  );
}

export function agentDividendDetails(options: RequestOptions<DividendDetailsResult, [AgentDividendsParams]> = {}) {
  return request(
    (params) => ({
      url: 'agentreport/dividenddetails',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false }, options),
  );
}

export function agentContribute(options: RequestOptions<ContributeResult, [AgentContributeParams]> = {}) {
  return request(
    (params) => ({
      url: 'agentreport/contributions',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false }, options),
  );
}
export function accountChangesApi(options: RequestOptions<AccountChangesResult, [AccountChangesParams]> = {}) {
  return request(
    (params) => ({
      url: 'agentreport/accountchanges',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false }, options),
  );
}
export function getTransactionTypeApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = false) {
  return request<TransactionTypeResult, [], T>(
    () => ({
      url: 'agentreport/accountchanges/transactiontypes',
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}

export function roundReportApi(options: RequestOptions<RoundReportResult, [BasePageParams]> = {}) {
  return request(
    (params) => ({
      url: 'agentreport/rounds',
      method: 'get',
      params: params,
    }),
    Object.assign({ noLoading: false }, options),
  );
}

export function getGameProviderApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = false) {
  return request<GameProviderResult, [], T>(
    () => ({
      url: 'gameprovider',
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}

export function getRoundReportStatusDataApi<T extends boolean = false>(returnAxios: T = false as T, noLoading = false) {
  return request<RoundReportStatus, [], T>(
    () => ({
      url: 'agentreport/rounds/status',
      method: 'get',
    }),
    { noLoading },
    returnAxios,
  );
}
