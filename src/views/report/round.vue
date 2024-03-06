<template>
  <el-card shadow="never" class="table">
    <el-row>
      <el-col :span="24">
        <div class="big-title">{{ $t('orderTracking') }}</div>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="24">
        <el-form :inline="true">
          <el-row :gutter="20">
            <el-col>
              <el-row :gutter="20" style="margin-bottom: 0px">
                <el-col :span="24">
                  <el-row :gutter="20" style="margin-bottom: 0px">
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <el-input v-model="searchForm.Username" size="large" :placeholder="$t('username')" clearable
                        /></el-col>
                        <el-col :span="8">
                          <el-input v-model="searchForm.RoundId" size="large" :placeholder="$t('roundId')" clearable />
                        </el-col>
                        <el-col :span="8">
                          <el-input
                            v-model="searchForm.ExternalRoundId"
                            size="large"
                            :placeholder="$t('externalRoundId')"
                            clearable
                        /></el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="12" :xs="24">
                      <div class="status-row">
                        <el-select v-model="searchForm.GameProviderId" size="large" :placeholder="t('status')">
                          <el-option :label="t('all')" value="" />
                          <el-option
                            v-for="(item, key) in gameproviders"
                            :key="key"
                            :label="t(item.name)"
                            :value="item.id"
                          />
                        </el-select>

                        <el-select v-model="searchForm.Status" size="large" :placeholder="t('status')">
                          <el-option :label="t('all')" value="" />
                          <el-option
                            v-for="(item, key) in statuses"
                            :key="key"
                            :label="t(item.data)"
                            :value="item.id"
                          />
                        </el-select>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col>
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
                <el-date-picker
                  v-model="searchForm.dateRange"
                  type="daterange"
                  size="large"
                  @change="daterangeChange"
                  :disabled-date="disabledDate"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="btnsearch" size="large" @click="onSearch()">{{
                  t('search')
                }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row style="margin-bottom: 5px">
          <el-col :span="24">
            <el-popover
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
        <el-table :data="tableData" stripe scrollbar-always-on resizable>
          <el-table-column :label="t('username')" prop="playerName" />
          <el-table-column
            prop="externalRoundId"
            :label="t('externalRoundId')"
            align="right"
            v-if="tableColumn.externalRoundId.isShow"
          >
            <template #default="{ row }">
              <div class="copy-container">
                <span @click="copyText(row.externalRoundId)">{{ row.externalRoundId }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" :label="t('roundId')" align="right" v-if="tableColumn.roundId.isShow">
            <template #default="{ row }">
              <div class="copy-container">
                <span @click="copyText(row.id)">{{ row.id }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdOn"
            :label="t('betTime')"
            align="right"
            :formatter="formatTime"
            v-if="tableColumn.betTime.isShow"
          />
          <el-table-column
            prop="closedOn"
            :label="t('closeTime')"
            align="right"
            :formatter="formatTime"
            v-if="tableColumn.closeTime.isShow"
          />
          <el-table-column
            prop="gameProviderName"
            :label="t('brandProvider')"
            align="right"
            v-if="tableColumn.brandProvider.isShow"
          />
          <el-table-column
            prop="subGameProviderName"
            :label="t('childBrandProvider')"
            align="right"
            v-if="tableColumn.childBrandProvider.isShow"
          />
          <el-table-column
            prop="status"
            :label="t('status')"
            align="right"
            :formatter="formatStatus"
            v-if="tableColumn.status.isShow"
          />
          <el-table-column
            prop="currencyCode"
            :label="t('currency')"
            align="right"
            v-if="tableColumn.currency.isShow"
          />
          <el-table-column
            prop="betAmount"
            :label="t('betAmount')"
            align="right"
            :formatter="formatPrice"
            v-if="tableColumn.betAmount.isShow"
          />
          <el-table-column
            prop="validBetAmount"
            :label="t('effectiveBet')"
            align="right"
            :formatter="formatPrice"
            v-if="tableColumn.effectiveBet.isShow"
          />
          <el-table-column
            prop="turnover"
            :label="t('turnover')"
            align="right"
            :formatter="formatPrice"
            v-if="tableColumn.turnover.isShow"
          />
          <el-table-column
            prop="settleAmount"
            :label="t('payout')"
            align="right"
            :formatter="formatPrice"
            v-if="tableColumn.payout.isShow"
          />
          <el-table-column
            prop="winLoss"
            v-if="tableColumn.winLose.isShow"
            :label="t('winLose')"
            align="right"
            :formatter="formatPrice"
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
        />
      </div>
    </el-row>
  </el-card>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  getGameProviderApi,
  roundReportApi,
  getRoundReportStatusDataApi,
  GameProviderResult,
  RoundReportStatus,
} from '@/api/agentreport';
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
interface DataColumn {
  username: {
    isShow: boolean;
    mustShow: boolean;
  };
  externalRoundId: {
    isShow: boolean;
    mustShow: boolean;
  };
  roundId: {
    isShow: boolean;
    mustShow: boolean;
  };
  betTime: {
    isShow: boolean;
    mustShow: boolean;
  };
  closeTime: {
    isShow: boolean;
    mustShow: boolean;
  };
  brandProvider: {
    isShow: boolean;
    mustShow: boolean;
  };
  childBrandProvider: {
    isShow: boolean;
    mustShow: boolean;
  };
  status: {
    isShow: boolean;
    mustShow: boolean;
  };
  currency: {
    isShow: boolean;
    mustShow: boolean;
  };
  betAmount: {
    isShow: boolean;
    mustShow: boolean;
  };
  effectiveBet: {
    isShow: boolean;
    mustShow: boolean;
  };
  turnover: {
    isShow: boolean;
    mustShow: boolean;
  };

  payout: {
    isShow: boolean;
    mustShow: boolean;
  };

  winLose: {
    isShow: boolean;
    mustShow: boolean;
  };
}
interface SpanMethodProps {
  row: ISubitems;
  column: TableColumnCtx<ISubitems>;
  rowIndex: number;
  columnIndex: number;
}
interface ISearchForm {
  page: number;
  rows: number;
  desc: boolean;
  sort: string;
  all: false;
  Username: string;
  RoundId: string;
  ExternalRoundId: string;
  GameProviderId: string;
  Status: string;
  From: string;
  To: string;
  dateRange: [Date, Date];
  ClosedFrom: string;
  ClosedTo: string;
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
    interface GameProvider {
      id: string;
      name: string;
    }

    return {
      tableData: reactive<any[]>([]),
      totalRowCount: 0,
      gameproviders: [] as GameProvider[],
      dateType: 'today',
      statuses: reactive<any[]>([]),
      tableColumn: reactive<DataColumn>({
        username: {
          isShow: true,
          mustShow: true,
        },
        externalRoundId: {
          isShow: true,
          mustShow: false,
        },
        roundId: {
          isShow: true,
          mustShow: false,
        },
        betTime: {
          isShow: true,
          mustShow: false,
        },
        closeTime: {
          isShow: true,
          mustShow: false,
        },
        brandProvider: {
          isShow: true,
          mustShow: false,
        },
        childBrandProvider: {
          isShow: true,
          mustShow: false,
        },
        status: {
          isShow: true,
          mustShow: false,
        },
        currency: {
          isShow: true,
          mustShow: false,
        },
        betAmount: {
          isShow: true,
          mustShow: false,
        },
        effectiveBet: {
          isShow: true,
          mustShow: false,
        },
        turnover: {
          isShow: true,
          mustShow: false,
        },

        payout: {
          isShow: true,
          mustShow: false,
        },

        winLose: {
          isShow: true,
          mustShow: false,
        },
      }),
      searchForm: reactive<ISearchForm>({
        page: 1,
        rows: 10,
        desc: true,
        sort: '',
        all: false,
        Username: '',
        RoundId: '',
        ExternalRoundId: '',
        GameProviderId: '',
        Status: '',
        From: '',
        To: '',
        dateRange: [new Date(), new Date()],
        ClosedFrom: '',
        ClosedTo: '',
      }),
    };
  },
  beforeMount() {
    this.getGameProviderId();
    this.getRoundReportStatus();

    this.onDateTypeChange();
  },
  methods: {
    async getGameProviderId() {
      const res = await getGameProviderApi();
      const result: GameProviderResult = await res.runAsync();
      const data = result.data;
      if (Array.isArray(data)) {
        this.gameproviders = data.map((provider) => ({ id: provider.id, name: provider.name }));
      } else {
        console.error('Invalid data format:', data);
      }
    },
    async getRoundReportStatus() {
      const res = await getRoundReportStatusDataApi();
      const result = await res.runAsync();
      this.statuses = Object.entries(result.data).map(([key, value]) => {
        return {
          id: key,
          name: key,
          data: value,
        };
      });
    },
    async copyText(textToCopy) {
      try {
        // Copy the text to the clipboard
        await navigator.clipboard.writeText(textToCopy);

        // Optionally, show a success message or perform other actions
        ElNotification({
          message: this.t('copySuccess'),
          type: 'success',
        });
      } catch (error) {
        // If copying fails, handle the error here
        console.error('Failed to copy text: ', error);
      }
    },
    async getItems() {
      //check if username is null
      if (this.searchForm.Username === '') {
        ElNotification({
          message: this.t('usernameCannotBeEmpty'),
          type: 'error',
        });
        return;
      }

      if (!this.searchForm.ClosedFrom || !this.searchForm.ClosedTo) {
        ElNotification({
          message: this.t('dateCannotBeEmpty'),
          type: 'error',
        });
        return;
      }

      let searchForm = { ...this.searchForm };
      searchForm.ClosedFrom = moment(searchForm.ClosedFrom).toISOString();
      searchForm.ClosedTo = moment(searchForm.ClosedTo).add(1, 'days').toISOString();
      const response = await roundReportApi();
      const result = await response.runAsync(searchForm);
      this.totalRowCount = result.data.totalcount;

      this.tableData = result.data.items;
    },

    formatPrice(row: any, column: TableColumnCtx<ISubitems>) {
      if (!isNaN(row[column.property])) {
        let percentage = '%' as string;
        if (column.property !== 'agentDividendPercentage') {
          percentage = '';
        }

        //return check if column.property can be .toFixed(2) or not
        return (row[column.property] as number).toFixed(2) + percentage;
      } else {
        return '';
      }
    },

    formatStatus(row: any, column: TableColumnCtx<ISubitems>) {
      return this.$t(this.statuses.filter((a) => a.name == row[column.property])[0].data);
    },

    formatTime(row: any, column: TableColumnCtx<ISubitems>) {
      return moment(row[column.property]).format('YYYY-MM-DD HH:mm:ss');
    },
    disabledDate(time: Date) {
      return time.getTime() > Date.now() || time.getTime() < moment().add(-1, 'd').add(-6, 'M').toDate().getTime();
    },
    daterangeChange() {
      this.searchForm.ClosedFrom = moment(this.searchForm.dateRange[0]).format('YYYY-MM-DD');
      this.searchForm.ClosedTo = moment(this.searchForm.dateRange[1]).format('YYYY-MM-DD');
    },
    onDateTypeChange() {
      if (this.dateType == 'today') {
        this.searchForm.ClosedFrom = moment().toISOString();
        this.searchForm.ClosedTo = moment().toISOString();
      } else if (this.dateType == 'yesterday') {
        this.searchForm.ClosedFrom = moment().subtract(1, 'days').toISOString();
        this.searchForm.ClosedTo = moment().subtract(1, 'days').toISOString();
      } else if (this.dateType == 'thisWeek') {
        this.searchForm.ClosedFrom = moment().startOf('week').toISOString();
        this.searchForm.ClosedTo = moment().endOf('week').toISOString();
      } else if (this.dateType == 'lastWeek') {
        this.searchForm.ClosedFrom = moment().subtract(1, 'weeks').startOf('week').toISOString();
        this.searchForm.ClosedTo = moment().subtract(1, 'weeks').endOf('week').toISOString();
      } else if (this.dateType == 'thisMonth') {
        this.searchForm.ClosedFrom = moment().startOf('month').toISOString();
        this.searchForm.ClosedTo = moment().endOf('month').toISOString();
      } else if (this.dateType == 'lastMonth') {
        this.searchForm.ClosedFrom = moment().subtract(1, 'months').startOf('month').toISOString();
        this.searchForm.ClosedTo = moment().subtract(1, 'months').endOf('month').toISOString();
      } else if (this.dateType == 'thisYear') {
        this.searchForm.ClosedFrom = moment().startOf('year').toISOString();
        this.searchForm.ClosedTo = moment().endOf('year').toISOString();
      } else if (this.dateType == 'lastYear') {
        this.searchForm.ClosedFrom = moment().subtract(1, 'years').startOf('year').toISOString();
        this.searchForm.ClosedTo = moment().subtract(1, 'years').endOf('year').toISOString();
      }
      this.searchForm.dateRange = [
        moment(this.searchForm.ClosedFrom).toDate(),
        moment(this.searchForm.ClosedTo).toDate(),
      ];
      this.searchForm.page = 1;
    },
    onSearch() {
      this.getItems();
    },

    customRowFormatter(row: any, column: TableColumnCtx<ISubitems>) {
      if (row.username === 'directAgent') {
        return this.$t('directAgent');
      } else if (row.username === 'Total') {
        return this.$t('total');
      } else {
        return row[column.property];
      }
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
  margin-left: 10px;
}
.btnsearch {
  margin-left: 10px;
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

.status-row {
  display: flex;

  .el-select {
    width: 100%;
  }
}
</style>
