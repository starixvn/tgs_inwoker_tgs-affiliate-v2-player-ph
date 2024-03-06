<template>
  <el-card shadow="never" class="table">
    <el-row>
      <el-col :span="24">
        <div class="big-title">{{ $t('winlossReport') }}</div>
      </el-col>
    </el-row>

    <el-row>
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
              @change="daterangeChange"
              :disabled-date="disabledDate"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="btnsearch" size="large" @click="onSearch()">{{ t('search') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="22">
        <div class="legends">
          <div>
            <el-button type="primary" icon="me-icon-info" @click="showlegends = !showlegends" />
          </div>
          <div v-show="showlegends === true">
            <div v-for="(legend, index) in legends" :key="index">
              <div>- {{ t(legend) }}</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="2">
        <el-popover
          style="float: right"
          placement="left-start"
          :width="200"
          trigger="click"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <el-button type="primary" class="btnsearch" size="large" style="float: right" icon="mel-icon-filter">
            </el-button>
          </template>
          <template #default>
            <div class="demo-rich-conent" style="display: flex; gap: 5px; flex-direction: column">
              <el-checkbox
                v-for="(item, index) in tableColumn"
                :key="index"
                :label="$t(index)"
                :disabled="item.mustShow"
                v-model="item.isShow"
              />
            </div>
          </template>
        </el-popover>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" :span-method="arraySpanMethod" :row-class-name="getRowClassName" stripe resizable>
          <el-table-column :label="t('player')">
            <el-table-column v-if="tableColumn.username.isShow" :label="t('username')" prop="username" />
            <el-table-column
              v-if="tableColumn.type.isShow"
              :label="t('type')"
              prop="type"
              :formatter="formatType"
              align="right"
            />
          </el-table-column>
          <el-table-column
            v-if="tableColumn.depositAmount.isShow"
            :label="t('depositAmount')"
            prop="depositAmount"
            :formatter="formatPrice"
            align="right"
          />
          <el-table-column
            v-if="tableColumn.withdrawalAmount.isShow"
            :label="t('withdrawalAmount')"
            prop="withdrawalAmount"
            :formatter="formatPrice"
            align="right"
          />
          <el-table-column
            v-if="tableColumn.bonusAmount.isShow"
            :label="t('bonusAmount')"
            prop="bonusAmount"
            :formatter="formatPrice"
            align="right"
          />
          <el-table-column
            v-if="tableColumn.bonusAdjustAmount.isShow"
            :label="t('bonusAdjustAmount')"
            prop="bonusAdjustAmount"
            :formatter="formatPrice"
            align="right"
          />

          <el-table-column
            v-if="tableColumn.agentAdjustAmount.isShow"
            :label="t('agentAdjustAmount')"
            prop="agentAdjustAmount"
            :formatter="formatPrice"
            align="right"
          />
          <el-table-column
            v-if="tableColumn.betAmount.isShow"
            :label="t('betAmount')"
            prop="betAmount"
            :formatter="formatPrice"
            align="right"
          />
          <el-table-column
            v-if="tableColumn.validBetAmount.isShow"
            :label="t('validBetAmount')"
            prop="validBetAmount"
            :formatter="formatPrice"
            align="right"
          />
          <el-table-column
            v-if="tableColumn.turnover.isShow"
            :label="t('turnover')"
            prop="turnover"
            :formatter="formatPrice"
            align="right"
          />
          <el-table-column
            v-if="tableColumn.winLossAmount.isShow"
            :label="t('winLossAmount')"
            prop="winLossAmount"
            :formatter="formatPrice"
            align="right"
          />
          <el-table-column
            v-if="tableColumn.netProfit.isShow"
            :label="t('netProfit')"
            prop="netProfit"
            :formatter="formatPrice"
            align="right"
          />

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
          :page-sizes="[10, 50, 200]"
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
  </el-card>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { agentContribute } from '@/api/agentreport';
import type { TableColumnCtx } from 'element-plus';
import moment from 'moment';
import { i18nAddResources } from '@wangeditor/editor';

interface ISubitems {
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
interface SpanMethodProps {
  row: ISubitems;
  column: TableColumnCtx<ISubitems>;
  rowIndex: number;
  columnIndex: number;
}
interface ISearchForm {
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
interface DataColumn {
  username: {
    isShow: boolean;
    mustShow: boolean;
  };
  type: {
    isShow: boolean;
    mustShow: boolean;
  };
  depositAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
  withdrawalAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
  bonusAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
  bonusAdjustAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
  agentAdjustAmount: {
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
  turnover: {
    isShow: boolean;
    mustShow: boolean;
  };
  winLossAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
  netProfit: {
    isShow: boolean;
    mustShow: boolean;
  };
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
      showAgent: false,
      tableData: reactive<any[]>([]),
      totalRowCount: 0,
      showlegends: false,
      legends: ['rl_winloss_row1', 'rl_winloss_row2'],
      tableColumn: reactive<DataColumn>({
        username: {
          isShow: true,
          mustShow: true,
        },
        type: {
          isShow: true,
          mustShow: false,
        },
        depositAmount: {
          isShow: true,
          mustShow: false,
        },
        withdrawalAmount: {
          isShow: true,
          mustShow: false,
        },
        bonusAmount: {
          isShow: true,
          mustShow: false,
        },
        bonusAdjustAmount: {
          isShow: true,
          mustShow: false,
        },
        agentAdjustAmount: {
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
        turnover: {
          isShow: true,
          mustShow: false,
        },
        winLossAmount: {
          isShow: true,
          mustShow: false,
        },
        netProfit: {
          isShow: true,
          mustShow: false,
        },
      }),
      searchForm: reactive<ISearchForm>({
        dateType: 'today',
        From: '',
        To: '',
        dateRange: [new Date(), new Date()],
        page: 1,
        rows: 10,
        desc: true,
        sort: '',
        all: false,
      }),
    };
  },
  beforeMount() {
    this.onDateTypeChange();
    this.getItems();
  },

  methods: {
    async getItems() {
      let searchForm = { ...this.searchForm };
      searchForm.From = moment(searchForm.From).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      searchForm.To = moment(searchForm.To).add(1, 'days').add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      const response = await agentContribute();
      const result = await response.runAsync(searchForm);
      const totalPlaceholder = { username: this.t('total') + ':' };

      const total = { ...totalPlaceholder, ...result.data.total };

      this.tableData = [total, ...result.data.items];
      this.totalRowCount = result.data.totalcount;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }: SpanMethodProps) {
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
      if (!isNaN(row[column.property])) {
        let percentage = '%' as string;
        if (column.property !== 'agentDividendPercentage') {
          percentage = '';
        }
        return row[column.property].toFixed(2) + percentage;
      } else {
        return '';
      }
    },
    formatType(row: any, column: TableColumnCtx<ISubitems>) {
      const { t } = useI18n();
      if (row[column.property] === 1) {
        return t('agent');
      } else if (row[column.property] === 2) {
        return t('player');
      } else {
        return '';
      }
    },
    onSearch() {
      this.getItems();
    },
    disabledDate(time: Date) {
      return time.getTime() > Date.now() || time.getTime() < moment().add(-1, 'd').add(-6, 'M').toDate().getTime();
    },
    daterangeChange() {
      this.searchForm.From = moment(this.searchForm.dateRange[0]).format('YYYY-MM-DD');
      this.searchForm.To = moment(this.searchForm.dateRange[1]).format('YYYY-MM-DD');
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
      this.getItems();
    },
    handleCurrentChange(val: number) {
      this.searchForm.page = val;
      this.getItems();
    },
  },
});
</script>
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
.subtotal-row {
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
</style>
