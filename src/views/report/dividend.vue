<template>
  <el-card shadow="never" class="table">
    <el-row>
      <el-col :span="24">
        <div class="big-title" v-show="scene === 'total'">{{ $t('profitShareReport') }}</div>
        <div class="big-title" v-show="scene === 'detail'">{{ $t('profitShareReportDetails') }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item>
            <el-radio-group v-model="dateType" size="large" @change="onDateTypeChange">
              <el-radio-button label="today">{{ t('today') }}</el-radio-button>
              <el-radio-button label="yesterday">{{ t('yesterday') }}</el-radio-button>
              <el-radio-button label="thisWeek">{{ t('thisWeek') }}</el-radio-button>
              <el-radio-button label="lastWeek">{{ t('lastWeek') }}</el-radio-button>
              <el-radio-button label="thisMonth">{{ t('thisMonth') }}</el-radio-button>
              <el-radio-button label="lastMonth">{{ t('lastMonth') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.dateRange" type="daterange" size="large" @change="daterangeChange"
              :disabled-date="disabledDate" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="btnsearch" size="large" @click="onSearch()">{{ t('search') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div v-show="scene === 'total'">
      <el-row>
        <el-col :span="22">
          <div class="legends">
            <div>
              <el-button size="small" class="custom-icon" circle type="primary" @click="showlegends = !showlegends"
                id="warningButton">
                <img id="warningIcon" :src="getImgUrl('warning')" />
              </el-button>
            </div>
            <div v-show="showlegends === true">
              <div v-for="(legend, index) in legends" :key="index">
                <div>- {{ t(legend) }}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
          <el-popover style="float: right" placement="left-start" :width="200" trigger="click"
            content="this is content, this is content, this is content">
            <template #reference>
              <el-button type="primary" class="btnsearch" size="large" style="float: right" icon="mel-icon-filter">
              </el-button>
            </template>
            <template #default>
              <div class="demo-rich-conent" style="display: flex; gap: 5px; flex-direction: column">
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                  {{ t('checkAll') }}
                </el-checkbox>
                <el-checkbox v-for="(item, index) in tableColumn" :key="index" :label="$t(index)"
                  :disabled="item.mustShow" v-model="item.isShow" />
              </div>
            </template>
          </el-popover>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" :span-method="arraySpanMethod" :row-class-name="getRowClassName" stripe
            @row-click="getDividendDetails">
            <el-table-column v-if="tableColumn.agent.isShow" :label="t('agent')" prop="username"
              :formatter="customRowFormatter" min-width="150" />
            <el-table-column v-if="tableColumn.pt.isShow" prop="agentDividendPercentage" :label="t('p/t')" align="right"
              :formatter="formatPrice" width="170" />
            <el-table-column v-if="tableColumn.bonus.isShow" :label="t('bonus')" align="center">
              <el-table-column prop="bonusAmount" :label="t('total')" align="right" :formatter="formatPrice" />
              <el-table-column prop="agentCoveredBonus" :label="t('agent')" align="right" :formatter="formatPrice" />
            </el-table-column>

            <el-table-column v-if="tableColumn.bonusAdjust.isShow" :label="t('bonusAdjust')" align="center">
              <el-table-column prop="bonusAdjustAmount" :label="t('total')" align="right" :formatter="formatPrice" />
              <el-table-column prop="agentCoveredBonusAdjust" :label="t('agent')" align="right" :formatter="formatPrice">
              </el-table-column>
            </el-table-column>
            <el-table-column v-if="tableColumn.betAmount.isShow" prop="betAmount" :label="t('betAmount')" align="right"
              :formatter="formatPrice" width="120" />
            <el-table-column v-if="tableColumn.validBetAmount.isShow" prop="validBetAmount" :label="t('validBetAmount')"
              align="right" :formatter="formatPrice" width="120" />
            <el-table-column v-if="tableColumn.winloss.isShow" prop="winLossAmount" :label="t('winloss')" align="right"
              :formatter="formatPrice" width="120" />
            <el-table-column v-if="tableColumn.netProfit.isShow" prop="netProfit" :label="t('netProfit')" align="right"
              :formatter="formatPrice" width="120" />
            <el-table-column :label="t('contribution')" align="center" v-if="tableColumn.contribution.isShow">
              <el-table-column prop="fromPlayerAgentDividendAmount" :label="t('player')" align="right"
                :formatter="formatPrice" />
              <el-table-column prop="fromTeamAgentDividendAmount" :label="t('team')" align="right"
                :formatter="formatPrice">
              </el-table-column>
            </el-table-column>
            <el-table-column v-if="tableColumn.agentAdjustAmount.isShow" prop="agentAdjustAmount"
              :label="t('agentAdjustAmount')" align="right" :formatter="formatPrice" width="150" />
            <el-table-column v-if="tableColumn.agentDividendAmount.isShow" prop="agentDividendAmount"
              :label="t('agentDividendAmount')" align="right" :formatter="formatPrice" width="150" />
            <template #empty>
              {{ t('noRecord') }}
            </template>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <div class="demo-pagination-block">
          <el-pagination v-model:current-page="searchForm.page" v-model:page-size="searchForm.rows"
            :page-sizes="[10, 50, 200]" layout="sizes, prev, pager, next" :total="totalRowCount"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-row>
    </div>
    <div v-show="scene === 'detail'">
      <el-row style="justify-content: end">
        <div class="back-btn no-select" @click="goBackResetEverything">« {{ t('goBack') }}</div>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" stripe :summary-method="getSummaries" show-summary>
            <el-table-column :label="t('agent')" prop="username" align="center" />
            <el-table-column prop="settlementDate" :label="t('settlementDate')" align="center" :formatter="formatDate" />
            <el-table-column props="settlementDateFrom, settlementDateTo" :label="t('settlementDateFromTo')"
              align="center" :formatter="formatIntervalDate" />
            <el-table-column prop="agentDividendAmount" :label="t('profitShareAmount')" align="center"
              :formatter="formatPrice" />

            <template #empty>
              {{ t('noRecord') }}
            </template>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <div class="demo-pagination-block">
          <el-pagination v-model:current-page="dividendDetailSearchForm.page"
            v-model:page-size="dividendDetailSearchForm.rows" :page-sizes="[10, 50, 200]"
            layout="sizes, prev, pager, next" :total="totalAgentDetailRowCount" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </el-row>
    </div>
  </el-card>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { agentDividends, agentDividendDetails } from '@/api/agentreport';
import type { TableColumnCtx } from 'element-plus';
import moment from 'moment';

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

interface SpanMethodProps {
  row: ISubitems;
  column: TableColumnCtx<ISubitems>;
  rowIndex: number;
  columnIndex: number;
}
interface ISearchForm {
  From: string;
  To: string;
  dateRange: [Date, Date];
  page: number;
  rows: number;
  desc: boolean;
  sort: string;
  all: boolean;
}

interface AgentDetailsSearchForm {
  AgentId: string;
  From: string;
  To: string;
  dateRange: [Date, Date];
  page: number;
  rows: number;
  desc: true;
  sort: string;
  all: boolean;
  agentDividendPercentage: number;
}
interface DataColumn {
  agent: {
    isShow: boolean;
    mustShow: boolean;
  };
  pt: {
    isShow: boolean;
    mustShow: boolean;
  };
  bonus: {
    isShow: boolean;
    mustShow: boolean;
  };
  bonusAdjust: {
    isShow: boolean;
    mustShow: boolean;
  };
  betAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
  validBetAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
  winloss: {
    isShow: boolean;
    mustShow: boolean;
  };
  netProfit: {
    isShow: boolean;
    mustShow: boolean;
  };
  contribution: {
    isShow: boolean;
    mustShow: boolean;
  };
  agentAdjustAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
  agentDividendAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
}
interface SummaryMethodProps<T = ISubitems> {
  columns: TableColumnCtx<T>[];
  data: T[];
}
export default defineComponent({
  name: 'MyComponent',
  setup() {
    const { t } = useI18n();

    return {
      t,
    };
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      tableData: reactive<any[]>([]),
      totalRowCount: 0,
      scene: 'total',
      totalAgentDetailRowCount: 0,
      showlegends: false,
      dateType: 'thisWeek',
      tableColumn: reactive<DataColumn>({
        agent: {
          isShow: true,
          mustShow: true,
        },
        pt: {
          isShow: true,
          mustShow: false,
        },
        bonus: {
          isShow: true,
          mustShow: false,
        },
        bonusAdjust: {
          isShow: true,
          mustShow: false,
        },
        betAmount: {
          isShow: true,
          mustShow: false,
        },
        validBetAmount: {
          isShow: true,
          mustShow: false,
        },
        winloss: {
          isShow: true,
          mustShow: false,
        },
        netProfit: {
          isShow: true,
          mustShow: false,
        },
        contribution: {
          isShow: true,
          mustShow: false,
        },
        agentAdjustAmount: {
          isShow: true,
          mustShow: false,
        },
        agentDividendAmount: {
          isShow: true,
          mustShow: false,
        },
      }),
      legends: [
        'rl_bonusAmount',
        'rl_agentCoveredBonus',
        'rl_agentCoveredBonusAdjust',
        'rl_netProfit',
        'rl_directPlayerContribution',
        'rl_teamContribution',
        'rl_profitSharingAmount',
      ],
      selectedUserId: '',
      selecterUserDividend: 0,
      searchForm: reactive<ISearchForm>({
        From: '',
        To: '',
        dateRange: [new Date(), new Date()],
        page: 1,
        rows: 10,
        desc: false,
        sort: '',
        all: false,
      }),

      dividendDetailSearchForm: reactive<AgentDetailsSearchForm>({
        AgentId: '',
        From: '',
        To: '',
        dateRange: [new Date(), new Date()],
        page: 1,
        rows: 10,
        desc: false,
        sort: '',
        all: false,
        agentDividendPercentage: 0,
      }),
    };
  },

  beforeMount() {
    this.onDateTypeChange();
    this.getItems();
  },

  methods: {
    handleCheckAllChange(value: any) {
      for (const columnKey in this.tableColumn) {
        if (!this.tableColumn[columnKey].mustShow) {
          this.tableColumn[columnKey].isShow = value;
        }
      }
      this.isIndeterminate = false;
    },
    async getItems() {
      let searchForm = { ...this.searchForm };
      searchForm.From = moment(searchForm.From).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      searchForm.To = moment(searchForm.To).add(1, 'days').add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      const response = await agentDividends();
      const result = await response.runAsync(searchForm);

      const emptyRow = { username: 'directAgent', id: '' } as ISubitems;
      const subtotalRow = result.data.subtotal;
      subtotalRow.username = 'Total';
      this.tableData = [...result.data.mainitems, ...[emptyRow], ...result.data.subitems, ...[subtotalRow]];
      this.totalRowCount = result.data.subtotalcount;
    },

    async getDividendDetails(row: any) {
      if (row.id != '') {
        this.scene = 'detail';
        this.selectedUserId = row.id || row.AgentId;
        this.selecterUserDividend = row.agentDividendPercentage;
        let searchForm = { ...this.dividendDetailSearchForm };
        searchForm.From = moment(searchForm.From).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
        searchForm.To = moment(searchForm.To).add(1, 'days').add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
        searchForm.AgentId = this.selectedUserId || row.id;
        searchForm.agentDividendPercentage = this.selecterUserDividend || row.agentDividendPercentage;

        const response = await agentDividendDetails();
        const result = await response.runAsync(searchForm);

        // Sort the items array in descending order based on settlementDate
        result.data.items.sort((a, b) => new Date(b.settlementDate) - new Date(a.settlementDate));

        this.tableData = [...result.data.items];
        this.totalAgentDetailRowCount = result.data.totalcount;
      }
    },

    goBackResetEverything() {
      this.scene = 'total';
      this.getItems();
    },

    formatDate(row: any, column: TableColumnCtx<ISubitems>) {
      return moment(row.settlementDate).format('YYYY-MM-DD');
    },
    formatIntervalDate(row: any, column: TableColumnCtx<ISubitems>) {
      var formatFrom = moment(row.settlementDateFrom).format('YYYY-MM-DD');
      var formatTo = moment(row.settlementDateTo).format('YYYY-MM-DD');
      return `${formatFrom} - ${formatTo}`;
    },
    getSummaries(param: SummaryMethodProps) {
      const { columns, data } = param;
      const sums: string[] = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t('pageTotal');
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => Number.isNaN(value))) {
          sums[index] = `${values
            .reduce((prev, curr) => {
              const value = Number(curr);
              if (!Number.isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0)
            ?.toFixed(2) || 0}`;
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }: SpanMethodProps) {
      if (row.username === '') {
        return [1, 14];
      }

      if (row.username == 'Total') {
        if (columnIndex == 0) {
          return [1, 2];
        }
        if (columnIndex == 1) {
          return [0, 0];
        }
      }
    },
    getRowClassName({ row, rowIndex }: { row: any; rowIndex: number }) {
      if (rowIndex === 1) {
        return 'empty-row';
      }
      if (row.username == 'Total') {
        return 'subtotal-row';
      }
    },

    formatPrice(row: any, column: TableColumnCtx<ISubitems>) {
      if (row[column.property] === null) {
        return '0.00';
      } else
        if (!isNaN(row[column.property])) {
          let percentage = '%' as string;
          if (column.property !== 'agentDividendPercentage') {
            percentage = '';
          }

          //return check if column.property can be .toFixed(2) or not
          return ((row[column.property] as number)?.toFixed(2) + percentage) || 0.00;
        } else {
          return '0.00';
        }
    },
    disabledDate(time: Date) {
      return time.getTime() > Date.now() || time.getTime() < moment().add(-1, 'd').add(-6, 'M').toDate().getTime();
    },
    getImgUrl(pic: string) {
      return '../assets/images/' + pic + '.svg';
    },
    daterangeChange() {
      this.searchForm.dateRange;

      this.searchForm.From = moment(this.searchForm.dateRange[0]).format('YYYY-MM-DD');
      this.searchForm.To = moment(this.searchForm.dateRange[1]).format('YYYY-MM-DD');
      this.dividendDetailSearchForm.From = moment(this.searchForm.dateRange[0]).format('YYYY-MM-DD');
      this.dividendDetailSearchForm.To = moment(this.searchForm.dateRange[1]).format('YYYY-MM-DD');
    },
    onDateTypeChange() {
      if (this.dateType == 'today') {
        this.searchForm.From = moment().format('YYYY-MM-DD');
        this.dividendDetailSearchForm.From = moment().format('YYYY-MM-DD');
        this.searchForm.To = moment().format('YYYY-MM-DD');
        this.dividendDetailSearchForm.To = moment().format('YYYY-MM-DD');
      } else if (this.dateType == 'yesterday') {
        this.searchForm.From = moment().subtract(1, 'days').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.From = moment().subtract(1, 'days').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'days').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.To = moment().subtract(1, 'days').format('YYYY-MM-DD');
      } else if (this.dateType == 'thisWeek') {
        this.searchForm.From = moment().startOf('week').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.From = moment().startOf('week').format('YYYY-MM-DD');
        this.searchForm.To = moment().endOf('week').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.To = moment().endOf('week').format('YYYY-MM-DD');
      } else if (this.dateType == 'lastWeek') {
        this.searchForm.From = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.From = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.To = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
      } else if (this.dateType == 'thisMonth') {
        this.searchForm.From = moment().startOf('month').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.From = moment().startOf('month').format('YYYY-MM-DD');
        this.searchForm.To = moment().endOf('month').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.To = moment().endOf('month').format('YYYY-MM-DD');
      } else if (this.dateType == 'lastMonth') {
        this.searchForm.From = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.From = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.To = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      } else if (this.dateType == 'thisYear') {
        this.searchForm.From = moment().startOf('year').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.From = moment().startOf('year').format('YYYY-MM-DD');
        this.searchForm.To = moment().endOf('year').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.To = moment().endOf('year').format('YYYY-MM-DD');
      } else if (this.dateType == 'lastYear') {
        this.searchForm.From = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.From = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD');
        this.dividendDetailSearchForm.To = moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD');
      }
      this.searchForm.dateRange = [moment(this.searchForm.From).toDate(), moment(this.searchForm.To).toDate()];
      this.dividendDetailSearchForm.dateRange = [
        moment(this.dividendDetailSearchForm.From).toDate(),
        moment(this.dividendDetailSearchForm.To).toDate(),
      ];
      this.searchForm.page = 1;
    },
    onSearch() {
      if (this.scene === 'total') {
        this.searchForm.rows = 10;
        this.searchForm.page = 1;
        this.getItems();
      } else if (this.scene === 'detail') {
        this.dividendDetailSearchForm.rows = 10;
        this.dividendDetailSearchForm.page = 1;
        this.getDividendDetails({ AgentId: this.selectedUserId, agentDividendPercentage: this.selecterUserDividend });
      }
    },

    customRowFormatter(row: any, column: TableColumnCtx<ISubitems>) {
      if (row.username === 'directAgent') {
        return this.$t('directAgent');
      } else if (row.username === 'Total') {
        return this.$t('pageTotal');
      } else {
        return row[column.property];
      }
    },

    handleSizeChange(val: number) {
      if (this.scene === 'total') {
        this.searchForm.rows = val;
        this.searchForm.page = 1;
        this.getItems();
      } else if (this.scene === 'detail') {
        this.dividendDetailSearchForm.rows = val;
        this.dividendDetailSearchForm.page = 1;
        this.getDividendDetails({ AgentId: this.selectedUserId, agentDividendPercentage: this.selecterUserDividend });
      }
    },
    handleCurrentChange(val: number) {
      if (this.scene === 'total') {
        this.searchForm.page = val;
        this.getItems();
      } else if (this.scene === 'detail') {
        this.dividendDetailSearchForm.page = val;
        this.getDividendDetails({ AgentId: this.selectedUserId, agentDividendPercentage: this.selecterUserDividend });
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}

.legends {
  display: flex;
  gap: 20px;
  padding: 0px 10px;
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

.datefrom {
  margin-left: 10px;
}

.btnsearch {
  margin-left: 10px;
}

.empty-row {
  background-color: #000000;
}

.el-table__row .subtotal-row {
  font-weight: bold !important;
}

.table {
  .search {
    margin-bottom: -18px;

    :deep(.el-input) {
      width: 319px;
    }
  }
}

.no-select {
  user-select: none;
}

.back-btn {
  cursor: pointer;
  color: var(--el-color-primary);
  font-weight: bold;
  text-decoration: underline;
}
</style>
<style lang="scss">
table thead tr th {
  .cell {
    text-align: center;
  }
}

.el-table__footer {
  tr {
    background-color: #eeeeee;

    >td {}
  }
}

.el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #eeeeee;
  font-weight: bold;
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
