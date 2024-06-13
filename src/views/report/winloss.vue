<template>
  <el-card shadow="never" class="table">
    <el-row>
      <el-col :span="24">
        <div class="big-title">{{ $t('winlossReport') }}</div>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 0px">
      <el-form :inline="true">
        <el-form-item>
          <div class="mt-4">
            <el-input v-model="searchForm.username" placeholder="Username" size="large" class="input-with-select">
              <template #prepend>
                <el-select v-model="searchForm.memberType" size="large" class="member-selection">
                  <el-option :label="t('agent')" value="agent" />
                  <el-option :label="t('player')" value="player" />
                </el-select>
              </template>
            </el-input>
          </div>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="margin-bottom: 0px">
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item>
            <el-radio-group v-model="searchForm.dateType" size="large" @change="onDateTypeChange">
              <el-radio-button label="today">{{ t('today') }}</el-radio-button>
              <el-radio-button label="yesterday">{{ t('yesterday') }}</el-radio-button>
              <el-radio-button label="thisWeek">{{ t('thisWeek') }}</el-radio-button>
              <el-radio-button label="lastWeek">{{ t('lastWeek') }}</el-radio-button>
              <el-radio-button label="thisMonth">{{ t('thisMonth') }}</el-radio-button>
              <el-radio-button label="lastMonth">{{ t('lastMonth') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              size="large"
              :disabled-date="disabledDate"
              @change="daterangeChange"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="btnsearch"
              size="large"
              :disabled="moment(searchForm.dateRange[1]).diff(moment(searchForm.dateRange[0]), 'days') > 31"
              @click="onSearch()"
              >{{ t('search') }}</el-button
            >

            <el-button type="primary" size="large" class="custom-icon" @click="onExport()">
              <img id="saveIcon" :src="getImgUrl('save')" />
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="22">
        <div class="legends">
          <div>
            <el-button
              id="warningButton"
              size="small"
              class="custom-icon"
              circle
              type="primary"
              @click="showlegends = !showlegends"
            >
              <img id="warningIcon" :src="getImgUrl('warning')" />
            </el-button>
          </div>
          <div v-show="showlegends === true">
            <div v-for="index in legends" :key="index">
              <div>- {{ t('rl_winloss_row' + index) }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-breadcrumb separator="/" data-="">
        <el-breadcrumb-item
          v-for="(item, index) in currenctUsername"
          :key="index"
          :class="currenctUsername.length - 1 == index ? 'bread-disable' : 'bread-enable'"
          @click="onClickBread(index)"
        >
          <span>
            {{ item.username }}
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div v-if="view === 0">
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" :span-method="arraySpanMethod" :row-class-name="getRowClassName" stripe resizable>
            <el-table-column :label="t('username')">
              <template #default="scope">
                <a v-if="scope.row.memberType === 'agent'" class="next-level" @click="onClickNext(scope.row.username)">
                  {{ scope.row.username }}
                </a>
                <a
                  v-if="scope.row.memberType === 'player'"
                  class="next-level"
                  @click="onClickPlayerRound(scope.row.username, scope.row.id)"
                >
                  {{ scope.row.username }}
                </a>
                <div v-if="scope.row.memberType === ''">
                  {{ translate(scope.row.username) + ':' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="t('memberType')" prop="memberType"></el-table-column>
            <el-table-column :label="t('totalOrder')" prop="roundCount" align="right"></el-table-column>
            <el-table-column :label="t('validBet')" prop="turnover" align="right"></el-table-column>
            <el-table-column :label="t('player')" align="center">
              <el-table-column :label="t('winloss')" prop="winLoss" :formatter="formatPrice" align="right" />
              <el-table-column :label="t('special')" align="right">
                <template #default="scope">
                  <el-popover placement="right" :width="400" trigger="click">
                    <template #reference>
                      <div
                        v-if="scope.row.memberType === 'agent'"
                        class="details-view"
                        @click="onViewDetails(0, scope.row.id)"
                      >
                        <el-icon style="" color="#07b5bc">
                          <mel-icon-plus />
                        </el-icon>
                      </div>
                    </template>
                    <table class="special-table" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <th>{{ t('special') }}</th>
                        <th class="right">{{ t('amount') }}</th>
                      </tr>
                      <tr>
                        <td>{{ t('bonus') }}</td>
                        <td class="right">{{ formatPrice2(agentPlayerSpecialDetailData.bonus) }}</td>
                      </tr>
                      <tr>
                        <td>{{ t('bonusAdjustAmount') }}</td>
                        <td class="right">{{ formatPrice2(agentPlayerSpecialDetailData.bonusAdjust) }}</td>
                      </tr>
                      <tr>
                        <th>{{ t('total') }}</th>
                        <th class="right">
                          {{
                            formatPrice2(
                              agentPlayerSpecialDetailData.bonus +
                              agentPlayerSpecialDetailData.bonusAdjust 
                            )
                          }}
                        </th>
                      </tr>
                    </table>
                  </el-popover>

                  {{ formatPrice2(scope.row.special) }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column :label="t('agent')" align="center">
              <el-table-column :label="t('winloss')" prop="agentWinLoss" :formatter="formatPrice" align="right" />
              <el-table-column :label="t('special')" prop="agentSpecial" :formatter="formatPrice" align="right" />

              <el-table-column :label="t('total')" align="right">
                <template #default="scope">
                  <el-popover placement="right" :width="800" trigger="click">
                    <template #reference>
                      <div
                        v-if="scope.row.memberType === 'agent'"
                        class="details-view"
                        @click="onViewDetails(1, scope.row.id)"
                      >
                        <el-icon style="" color="#07b5bc">
                          <mel-icon-plus />
                        </el-icon>
                      </div>
                    </template>
                    <el-table :data="agentTotalDetailsData">
                      <el-table-column :label="t('settlePeriod')" width="200">
                        <template #default="scope">
                          {{ formatDate(scope.row.from) }}-{{ formatDate(scope.row.to) }}
                        </template>
                      </el-table-column>

                      <el-table-column
                        :label="t('p/t')"
                        prop="percentage"
                        align="right"
                        :formatter="formatPricePercentage"
                      />
                      <el-table-column :label="t('player')" align="center">
                        <el-table-column
                          :label="t('winloss')"
                          prop="playerWinLoss"
                          align="right"
                          :formatter="formatPrice"
                        />
                        <el-table-column
                          :label="t('special')"
                          prop="playerSpecial"
                          align="right"
                          :formatter="formatPrice"
                        />
                      </el-table-column>

                      <el-table-column :label="t('agent')" align="center">
                        <el-table-column
                          :label="t('winloss')"
                          prop="agentWinLoss"
                          align="right"
                          :formatter="formatPrice"
                        />
                        <el-table-column
                          :label="t('special')"
                          prop="agentSpecial"
                          align="right"
                          :formatter="formatPrice"
                        />
                        <el-table-column :label="t('total')" prop="agentTotal" align="right" :formatter="formatPrice" />
                      </el-table-column>
                    </el-table>
                  </el-popover>

                  {{ formatPrice2(scope.row.agentTotal) }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column :label="t('company')" align="center">
              <el-table-column :label="t('winloss')" prop="companyWinLoss" :formatter="formatPrice" align="right" />
              <el-table-column :label="t('special')" prop="companySpecial" :formatter="formatPrice" align="right" />
              <el-table-column :label="t('total')" align="right">
                <template #default="scope">
                  <el-popover placement="right" :width="800" trigger="click">
                    <template #reference>
                      <div
                        v-if="scope.row.memberType === 'agent'"
                        class="details-view"
                        @click="onViewDetails(2, scope.row.id)"
                      >
                        <el-icon style="" color="#07b5bc">
                          <mel-icon-plus />
                        </el-icon>
                      </div>
                    </template>
                    <el-table :data="companyTotalDetailsData">
                      <el-table-column :label="t('settlePeriod')" width="200">
                        <template #default="scope">
                          {{ formatDate(scope.row.from) }}-{{ formatDate(scope.row.to) }}
                        </template>
                      </el-table-column>

                      <el-table-column
                        :label="t('p/t')"
                        prop="percentage"
                        align="right"
                        :formatter="formatPricePercentage"
                      />
                      <el-table-column :label="t('player')" align="center">
                        <el-table-column
                          :label="t('winloss')"
                          prop="playerWinLoss"
                          align="right"
                          :formatter="formatPrice"
                        />
                        <el-table-column
                          :label="t('special')"
                          prop="playerSpecial"
                          align="right"
                          :formatter="formatPrice"
                        />
                      </el-table-column>

                      <el-table-column :label="t('company')" align="center">
                        <el-table-column
                          :label="t('winloss')"
                          prop="companyWinLoss"
                          align="right"
                          :formatter="formatPrice"
                        />
                        <el-table-column
                          :label="t('special')"
                          prop="companySpecial"
                          align="right"
                          :formatter="formatPrice"
                        />
                        <el-table-column
                          :label="t('total')"
                          prop="companyTotal"
                          align="right"
                          :formatter="formatPrice"
                        />
                      </el-table-column>
                    </el-table>
                  </el-popover>

                  {{ formatPrice2(scope.row.companyTotal) }}
                </template>
              </el-table-column>
            </el-table-column>
            <template #empty>
              {{ t('noRecord') }}
            </template>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="searchForm.page"
            v-model:page-size="searchForm.rows"
            :page-sizes="[20, 50, 200]"
            layout="sizes, prev, pager, next"
            :total="totalRowCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <template #sizes>
              <span>{{ totalRowCount }} Rows</span>
            </template>
          </el-pagination>
        </div>
      </el-row>
    </div>

    <div v-if="view === 1">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="roundsData"
            :span-method="arraySpanMethod"
            :row-class-name="getRowClassName"
            stripe
            resizable
            border
            fit
          >
            <el-table-column :label="t('orderId')" width="140">
              <template #default="scope">
                <div class="ellipsis" @click="clickToCopy(scope.row.id)">{{ translate(scope.row.id) + ':' }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="t('extOrderId')" prop="externalRoundId" width="140">
              <template #default="scope">
                <div class="ellipsis" @click="clickToCopy(scope.row.externalRoundId)">
                  {{ scope.row.externalRoundId }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="t('createdOn')" width="160">
              <template #default="scope">
                {{ formatDateWithTime(scope.row.createdOn) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('closedOn')" width="160">
              <template #default="scope">
                {{ formatDateWithTime(scope.row.closedOn) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('subProvider')" prop="subGameProviderName"></el-table-column>
            <el-table-column :label="t('gameName')" prop="gameName"></el-table-column>
            <el-table-column :label="t('status')" prop="status" align="center" width="80">
              <template #default="scope">
                <div :class="'roundStatus-' + scope.row.status">{{ formatRoundsStatus(scope.row.status) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('betAmount')"
              prop="betAmount"
              align="right"
              :formatter="formatPrice"
            ></el-table-column>
            <el-table-column
              :label="t('validBet')"
              prop="validBetAmount"
              align="right"
              :formatter="formatPrice"
            ></el-table-column>
            <el-table-column
              :label="t('turnover')"
              prop="turnover"
              align="right"
              :formatter="formatPrice"
            ></el-table-column>
            <el-table-column
              :label="t('settlement')"
              prop="settleAmount"
              align="right"
              :formatter="formatPrice"
            ></el-table-column>
            <el-table-column
              :label="t('winloss')"
              prop="winLoss"
              align="right"
              :formatter="formatPrice"
            ></el-table-column>
            <template #empty>
              {{ t('noRecord') }}
            </template>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="roundsSearchForm.page"
            v-model:page-size="roundsSearchForm.rows"
            :page-sizes="[20, 50, 200]"
            layout="sizes, prev, pager, next"
            :total="roundsTotalRowCount"
            @size-change="handleRoundsSizeChange"
            @current-change="handleRoundsCurrentChange"
          >
            <template #sizes>
              <span>{{ roundsTotalRowCount }} Rows</span>
            </template>
          </el-pagination>
        </div>
      </el-row>
    </div>
  </el-card>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  agentWinlossReportApi,
  agentPlayerSpecialDetailApi,
  agentTotalDetailApi,
  companyTotalDetailApi,
  AgentWinlossReportParams,
  WinlossReportItem,
  CompanyTotalDetailParams,
  AgentTotalDetailParams,
  AgentPlayerSpecialDetailParams,
  CompanyTotalDetailData,
  AgentTotalDetailData,
  AgentPlayerSpecialDetailData,
  roundsApi,
  RoundsParams,
  RoundsData,
  exportAgentWinLossApi,
  exportRoundsApi,
  breadcrumbApi,
  BreadcrumbParams,
  BreadcrumbData,
} from '@/api/agentwinlossreport';
import type { TableColumnCtx } from 'element-plus';
import moment from 'moment';
import { useUserStore } from '@/store';

interface SpanMethodProps {
  row: WinlossReportItem;
  column: TableColumnCtx<WinlossReportItem>;
  rowIndex: number;
  columnIndex: number;
}
interface ISearchForm {
  memberType: string;
  username: string;
  downLine: boolean;
  dateType: string;
  From: string;
  To: string;
  dateRange: [Date, Date];
  page: number;
  rows: number;
  desc: boolean;
  sort: string;
  all: boolean;
}
class BreadCrumb {
  id = '';
  username = '';
}

export default defineComponent({
  name: 'MyComponent',
  setup() {
    const { t } = useI18n();
    const userStore = useUserStore();
    return {
      t,
      userStore,
    };
  },

  data() {
    return {
      currenctUsername: reactive<BreadCrumb[]>([]),
      visible: false,
      showAgent: false,
      dialogRoundVisible: false,
      roundsData: reactive<RoundsData[]>([]),
      companyTotalDetailsData: reactive<CompanyTotalDetailData[]>([]),
      agentTotalDetailsData: reactive<AgentTotalDetailData[]>([]),
      agentPlayerSpecialDetailData: reactive<AgentPlayerSpecialDetailData>({
        bonus: 0,
        bonusAdjust: 0,
        productFee: 0,
        platformCharge: 0,
      }),
      tableData: reactive<any[]>([]),
      totalRowCount: 0,
      roundsTotalRowCount: 0,
      showlegends: false,
      view: 0,
      legends: 10,
      roundsSearchForm: reactive<ISearchForm>({
        dateType: 'today',
        memberType: 'agent',
        username: '',
        downLine: true,
        From: '',
        To: '',
        dateRange: [new Date(), new Date()],
        page: 1,
        rows: 20,
        desc: true,
        sort: '',
        all: false,
      }),
      searchForm: reactive<ISearchForm>({
        dateType: 'today',
        memberType: 'agent',
        username: '',
        downLine: true,
        From: '',
        To: '',
        dateRange: [new Date(), new Date()],
        page: 1,
        rows: 20,
        desc: true,
        sort: '',
        all: false,
      }),
    };
  },
  beforeMount() {
    this.onDateTypeChange();
    const userStore = useUserStore();
    let breadCrumb = new BreadCrumb();
    breadCrumb.username = userStore.user.username;
    this.currenctUsername.push(breadCrumb);
    this.getItems(true);
  },

  methods: {
    moment,
    async getItems(downLine: boolean) {
      let searchForm = { ...this.searchForm };
      searchForm.From = moment(searchForm.From).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      searchForm.To = moment(searchForm.To).add(1, 'days').add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      const response = await agentWinlossReportApi();
      const agentWinlossReportParams: AgentWinlossReportParams = {
        username:
          this.currenctUsername.length > 1 ? this.currenctUsername[this.currenctUsername.length - 1].username : '',
        memberType: 'agent',
        downLine: downLine,
        from: searchForm.From,
        to: searchForm.To,
        page: searchForm.page,
        rows: searchForm.rows,
        desc: false,
        sort: '',
        all: false,
      };

      const result = await response.runAsync(agentWinlossReportParams);
      const totalPlaceholder = { username: 'total', memberType: '' };

      const total = { ...totalPlaceholder, ...result.data.total };
      if (result.data.items.length > 0) {
        this.tableData = [...result.data.items, total];
      } else {
        this.tableData = [];
      }

      this.totalRowCount = result.data.totalCount;
    },
    async getRoundsItems() {
      let searchForm = { ...this.searchForm };
      searchForm.From = moment(searchForm.From).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      searchForm.To = moment(searchForm.To).add(1, 'days').add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      const response = await roundsApi();
      const roundsParams: RoundsParams = {
        playerCode: this.currenctUsername[this.currenctUsername.length - 1].id,
        closedFrom: searchForm.From,
        closedTo: searchForm.To,
        page: this.roundsSearchForm.page,
        rows: this.roundsSearchForm.rows,
        desc: false,
        sort: '',
        all: false,
      };

      const result = await response.runAsync(roundsParams);

      const roundsTotal: RoundsData = {
        closedOn: '',
        createdOn: '',
        externalRoundId: '',
        gameName: '',
        gameProviderName: '',
        id: 'total',
        playerCode: '',
        playerName: '',
        status: 0,
        subGameProviderName: '',
        turnover: 0,
        ...result.data.total,
      };
      const roundsPageTotal: RoundsData = {
        closedOn: '',
        createdOn: '',
        externalRoundId: '',
        gameName: '',
        gameProviderName: '',
        id: 'pageTotal',
        playerCode: '',
        playerName: '',
        status: 0,
        subGameProviderName: '',
        turnover: 0,
        betAmount: 0,
        settleAmount: 0,
        validBetAmount: 0,
        winLoss: 0,
      };
      for (var i = 0; i < result.data.items.length; i++) {
        roundsPageTotal.turnover += result.data.items[i].turnover;
        roundsPageTotal.betAmount += result.data.items[i].betAmount;
        roundsPageTotal.settleAmount += result.data.items[i].settleAmount;
        roundsPageTotal.validBetAmount += result.data.items[i].validBetAmount;
        roundsPageTotal.winLoss += result.data.items[i].winLoss;
      }
      if (result.data.items.length > 0) {
        this.roundsData = [...result.data.items, roundsPageTotal, roundsTotal];
      } else {
        this.roundsData = [];
      }

      this.roundsTotalRowCount = result.data.totalCount;
    },
    getImgUrl(pic: string) {
      return '../assets/images/' + pic + '.svg';
    },
    translate(item: string) {
      return this.t(item);
    },
    clickToCopy(item: string) {
      navigator.clipboard.writeText(item);
      ElNotification({
        message: this.t('copySuccess'),
        type: 'success',
      });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }: SpanMethodProps) {
      if (row.memberType == '') {
        if (columnIndex == 0) {
          return [1, 2];
        }
        if (columnIndex == 1) {
          return [0, 0];
        }
      } else if (row.id == 'total' || row.id == 'pageTotal') {
        if (columnIndex == 0) {
          return [1, 7];
        }
        if (
          columnIndex == 1 ||
          columnIndex == 2 ||
          columnIndex == 3 ||
          columnIndex == 4 ||
          columnIndex == 5 ||
          columnIndex == 6
        ) {
          return [0, 0];
        }
      }
    },
    getRowClassName({ row, rowIndex }: { row: any; rowIndex: number }) {
      if (row.memberType == '' || row.id == 'total' || row.id == 'pageTotal') {
        return 'custom-background-color';
      }
    },
    formatPrice(row: any, column: TableColumnCtx<WinlossReportItem>) {
      if (!isNaN(row[column.property])) {
        let percentage = '%' as string;
        if (column.property !== 'agentDividendPercentage') {
          percentage = '';
        }

        return this.formatTo2Decimal(row[column.property]) + percentage;
      } else {
        return '';
      }
    },
    formatTo2Decimal(val: number) {
      var spt = val.toString().split('.');
      var stringVal = spt[0] + '.';
      if (spt.length > 1) {
        if (spt[1].length > 2) {
          stringVal += spt[1].substring(0, 2);
        } else {
          stringVal += spt[1];
          if (spt[1].length === 1) {
            stringVal += '0';
          }
        }
      } else {
        stringVal += '00';
      }
      return stringVal;
    },
    formatDate(datetime: string) {
      return moment(datetime).format('YYYY/MM/DD');
    },
    formatDateWithTime(datetime: string) {
      return moment(datetime).format('YYYY/MM/DD HH:mm:ss');
    },
    formatRoundsStatus(status: string): string {
      const { t } = useI18n();
      return t('roundStatus' + status);
    },
    formatPrice2(val: number) {
      return this.formatTo2Decimal(val);
    },
    formatPricePercentage(row: any, column: TableColumnCtx<WinlossReportItem>) {
      return row[column.property].toFixed(2) + '%';
    },
    formatType(row: any, column: TableColumnCtx<WinlossReportItem>) {
      const { t } = useI18n();
      if (row[column.property] === 1) {
        return t('agent');
      } else if (row[column.property] === 2) {
        return t('player');
      } else {
        return '';
      }
    },

    async onViewDetails(view: number, id: string) {
      let searchForm = { ...this.searchForm };
      searchForm.From = moment(searchForm.From).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      searchForm.To = moment(searchForm.To).add(1, 'days').add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      if (view == 0) {
        const response = await agentPlayerSpecialDetailApi();
        var agentPlayerSpecialDetailParams = new AgentPlayerSpecialDetailParams();
        agentPlayerSpecialDetailParams.from = searchForm.From;
        agentPlayerSpecialDetailParams.to = searchForm.To;
        agentPlayerSpecialDetailParams.agentId = id;

        const result = await response.runAsync(agentPlayerSpecialDetailParams);

        this.agentPlayerSpecialDetailData = result.data;
      } else if (view == 1) {
        const response = await agentTotalDetailApi();
        var agentTotalDetailParams = new AgentTotalDetailParams();
        agentTotalDetailParams.from = searchForm.From;
        agentTotalDetailParams.to = searchForm.To;
        agentTotalDetailParams.agentId = id;

        const result = await response.runAsync(agentTotalDetailParams);

        this.agentTotalDetailsData = result.data;
      } else if (view == 2) {
        const response = await companyTotalDetailApi();
        var companyTotalDetailParams = new CompanyTotalDetailParams();
        companyTotalDetailParams.from = searchForm.From;
        companyTotalDetailParams.to = searchForm.To;
        companyTotalDetailParams.agentId = id;

        const result = await response.runAsync(companyTotalDetailParams);

        this.companyTotalDetailsData = result.data;
      }
    },
    async onSearch() {
      this.view = 0;
      this.currenctUsername = [];

      if (this.searchForm.username.trim() !== '') {
        this.searchForm.downLine = true;
        const breadcrumbParams: BreadcrumbParams = {
          username: this.searchForm.username,
          memberType: this.searchForm.memberType,
          roundId: '',
        };
        const response = await breadcrumbApi();
        const result = await response.runAsync(breadcrumbParams);
        if (result.data.length > 0) {
          for (var i = 0; i < result.data.length; i++) {
            let breadCrumb = new BreadCrumb();
            breadCrumb.id = '';
            breadCrumb.username = result.data[i].username;
            this.currenctUsername.push(breadCrumb);
          }
        } else {
          this.searchForm.username = '';
          this.searchForm.downLine = true;
          const userStore = useUserStore();
          let breadCrumb = new BreadCrumb();
          breadCrumb.username = userStore.user.username;
          this.currenctUsername.push(breadCrumb);
        }
      } else {
        this.searchForm.downLine = true;
        const userStore = useUserStore();
        let breadCrumb = new BreadCrumb();
        breadCrumb.username = userStore.user.username;
        this.currenctUsername.push(breadCrumb);
      }

      this.searchForm.page = 1;
      this.getItems(this.searchForm.downLine);
    },

    disabledDate(time: Date) {
      return time.getTime() > Date.now() || time.getTime() < moment().add(-1, 'd').add(-6, 'M').toDate().getTime();
    },
    daterangeChange() {
      //check if duration between dateFrom and dateTo is exceed 31 days
      if (moment(this.searchForm.dateRange[1]).diff(moment(this.searchForm.dateRange[0]), 'days') > 31) {
        ElNotification({
          message: this.t('cannotExceed31Days'),
          type: 'error',
        });
      }

      this.searchForm.From = moment(this.searchForm.dateRange[0]).format('YYYY-MM-DD');
      this.searchForm.To = moment(this.searchForm.dateRange[1]).format('YYYY-MM-DD');
    },
    onClickNext(username: string) {
      this.searchForm.page = 1;
      let breadCrumb = new BreadCrumb();
      breadCrumb.username = username;
      this.currenctUsername.push(breadCrumb);

      this.getItems(true);
    },
    async onClickPlayerRound(username: string, id: string) {
      this.roundsSearchForm.page = 1;
      let breadCrumb = new BreadCrumb();
      breadCrumb.username = username;
      breadCrumb.id = id;
      this.currenctUsername.push(breadCrumb);

      this.getRoundsItems();
      this.view = 1;
    },
    onClickBread(index: number) {
      if (index == this.currenctUsername.length - 1) return;
      this.searchForm.page = 1;
      this.currenctUsername = this.currenctUsername.slice(0, index + 1);
      this.getItems(true);
      this.view = 0;
    },
    async onExport() {
      let searchForm = { ...this.searchForm };
      searchForm.From = moment(searchForm.From).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      searchForm.To = moment(searchForm.To).add(1, 'days').add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      let response = null;
      if (this.view == 0) {
        const agentWinlossReportParams: AgentWinlossReportParams = {
          username:
            this.currenctUsername.length > 1 ? this.currenctUsername[this.currenctUsername.length - 1].username : '',
          downLine: true,
          from: searchForm.From,
          to: searchForm.To,
          page: searchForm.page,
          rows: searchForm.rows,
          desc: false,
          sort: '',
          all: false,
          memberType: searchForm.memberType,
        };
        response = await exportAgentWinLossApi();
        response = await response.runAsync(agentWinlossReportParams);
      } else {
        const roundsParams: RoundsParams = {
          playerCode: this.currenctUsername[this.currenctUsername.length - 1].id,
          closedFrom: searchForm.From,
          closedTo: searchForm.To,
          page: this.roundsSearchForm.page,
          rows: this.roundsSearchForm.rows,
          desc: false,
          sort: '',
          all: false,
        };

        response = await exportRoundsApi();
        response = await response.runAsync(roundsParams);
      }

      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/vnd.ms-excel' }));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'export.xlsx'); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    },
    onDateTypeChange() {
      if (this.searchForm.dateType == 'today') {
        this.searchForm.From = moment().format('YYYY-MM-DD');
        this.searchForm.To = moment().format('YYYY-MM-DD');
      } else if (this.searchForm.dateType == 'yesterday') {
        this.searchForm.From = moment().subtract(1, 'days').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'days').format('YYYY-MM-DD');
      } else if (this.searchForm.dateType == 'thisWeek') {
        this.searchForm.From = moment().startOf('week').format('YYYY-MM-DD');
        this.searchForm.To = moment().endOf('week').format('YYYY-MM-DD');
      } else if (this.searchForm.dateType == 'lastWeek') {
        this.searchForm.From = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
      } else if (this.searchForm.dateType == 'thisMonth') {
        this.searchForm.From = moment().startOf('month').format('YYYY-MM-DD');
        this.searchForm.To = moment().endOf('month').format('YYYY-MM-DD');
      } else if (this.searchForm.dateType == 'lastMonth') {
        this.searchForm.From = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      } else if (this.searchForm.dateType == 'thisYear') {
        this.searchForm.From = moment().startOf('year').format('YYYY-MM-DD');
        this.searchForm.To = moment().endOf('year').format('YYYY-MM-DD');
      } else if (this.searchForm.dateType == 'lastYear') {
        this.searchForm.From = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD');
      }
      this.searchForm.dateRange = [moment(this.searchForm.From).toDate(), moment(this.searchForm.To).toDate()];
      this.searchForm.page = 1;
    },

    handleSizeChange(val: number) {
      this.searchForm.rows = val;
      this.searchForm.page = 1;
      this.getItems(true);
    },
    handleCurrentChange(val: number) {
      this.searchForm.page = val;
      this.getItems(true);
    },
    handleRoundsSizeChange(val: number) {
      this.roundsSearchForm.rows = val;
      this.roundsSearchForm.page = 1;
      this.getRoundsItems();
    },
    handleRoundsCurrentChange(val: number) {
      this.roundsSearchForm.page = val;
      this.getRoundsItems();
    },
  },
});
</script>
<style>
.custom-background-color {
  background-color: #f5f7fa !important; /* Your desired background color */
}
.custom-background-color td {
  background-color: #f5f7fa !important; /* Your desired background color */
}
</style>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.datefrom {
  margin-right: 10px;
}

.empty-row {
  background-color: #000000;
}

.table {
  .search {
    margin-bottom: -18px;

    :deep(.el-input) {
      width: 319px;
    }
  }
}

.legends {
  display: flex;
  gap: 20px;
  padding: 0px 0px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

.legendsToggle {
  background: var(--el-color-primary);
  color: #fff;
  border-radius: 50px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.details-view {
  cursor: pointer;
  height: 100%;
  float: left;
  display: flex;
  margin-top: 3px;
}
.special-table {
  width: 100%;
  border-left: 1px solid #ebeef5;
  table-layout: fixed;

  .right {
    text-align: right;
  }
  tr {
    th {
      background: var(--el-fill-color-light);
      padding: 8px 12px;
      min-width: 0;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
      text-align: left;
      z-index: 1;
    }
    td {
      border-bottom: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      padding: 8px 12px;
      min-width: 0;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
      text-align: left;
      z-index: 1;
    }
  }
}
.next-level {
  text-decoration: underline;
  cursor: pointer;
  color: rgb(56, 56, 231) !important;
}
.bread-disable {
}
.bread-enable {
  color: rgb(56, 56, 231) !important;
  text-decoration: underline;
  cursor: pointer;
  span {
    color: rgb(56, 56, 231) !important;
    text-decoration: underline;
  }
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.roundStatus-3 {
  color: green;
}
.roundStatus-4 {
  color: red;
}
.custom-icon {
  font-size: 1.5rem;
  padding: 15px;
}
.member-selection {
  width: 100px;
}
.input-with-select {
  width: 402px;
}

#saveIcon {
  height: 15px;
  width: 15px;
  filter: invert(100%);
}

#warningButton {
  background: #fec048;
  border: none;
}

#warningIcon {
  height: 15px;
  width: 15px;
  filter: invert(100%);
}
</style>
