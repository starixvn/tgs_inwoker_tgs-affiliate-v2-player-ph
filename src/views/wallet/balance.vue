<template>
  <el-card shadow="never" class="table">
    <el-row style="margin-bottom: 0px">
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item>
            <el-select
              v-model="searchForm.transactiontype"
              class="modded-select"
              size="large"
              style="width: 100%"
              :placeholder="$t('transactionType')"
            >
              <el-option :label="$t('transactionType')" value="" />
              <el-option
                v-for="(value, propertyName) in transactionTypeList"
                :key="propertyName"
                :label="$t(value)"
                :value="propertyName"
              />
            </el-select>
          </el-form-item>
        </el-form>
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
      <el-col :span="24">
        <el-table :data="tableData" stripe>
          <el-table-column :label="t('time')" prop="recordedOn" align="center" :formatter="formatDate">
          </el-table-column>
          <el-table-column
            prop="transactionType"
            :label="t('transactionType')"
            align="center"
            :formatter="formatTransactionType"
            width="150"
          />

          <el-table-column prop="amount" :label="t('amount')" align="right" :formatter="formatPrice" />
          <el-table-column prop="balance" :label="t('balance')" align="right" :formatter="formatPrice" />

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
  accountChangesApi,
  AccountChangesItems,
  AccountChangesParams,
  getTransactionTypeApi,
  TransactionTypeData,
} from '@/api/agentreport';
import type { TableColumnCtx } from 'element-plus';
import moment from 'moment';
import formatNumber from 'format-number';
import { useUserStore } from '@/store';

export default defineComponent({
  name: 'MyComponent',
  setup() {
    const { t } = useI18n();
    const userStore = useUserStore();
    return {
      t,
      formatNumber,
      userStore,
    };
  },
  data() {
    return {
      tableData: reactive<AccountChangesItems[]>([]),
      transactionTypeList: reactive<TransactionTypeData>({}),
      totalRowCount: 0,
      searchForm: reactive<AccountChangesParams>({
        From: '',
        To: '',
        dateRange: [new Date(), new Date()],
        page: 1,
        rows: 10,
        desc: true,
        sort: 'recordedOn',
        all: false,
        transactiontype: '',
        id: '',
      }),
      dateType: 'today',
    };
  },
  beforeMount() {
    this.onDateTypeChange();
    this.getItems();
    this.getTransactionType();
  },

  methods: {
    async getItems() {
      this.searchForm.id = this.userStore.user.id;
      let searchForm = { ...this.searchForm };
      searchForm.From = moment(searchForm.From).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');

      searchForm.To = moment(searchForm.To).add(1, 'days').add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      const response = await accountChangesApi();
      const result = await response.runAsync(searchForm);
      this.tableData = result.data.items;
      this.totalRowCount = result.data.totalcount;
    },
    async getTransactionType() {
      const response = await getTransactionTypeApi();
      const result = await response.runAsync();
      this.transactionTypeList = result.data;
    },
    formatPrice(row: any, column: TableColumnCtx<AccountChangesItems>) {
      return formatNumber({ truncate: 2, padRight: 2 })(row[column.property]);
    },
    formatDate(row: any, column: TableColumnCtx<AccountChangesItems>) {
      return moment(row[column.property]).format('YYYY-MM-DD HH:mm:ss');
    },
    formatTransactionType(row: any, column: TableColumnCtx<AccountChangesItems>) {
      const transactionType = this.transactionTypeList[row[column.property]];
      return this.t(transactionType ?? '');
    },
    onDateTypeChange() {
      if (this.dateType == 'today') {
        this.searchForm.From = moment().format('YYYY-MM-DD');
        this.searchForm.To = moment().format('YYYY-MM-DD');
      } else if (this.dateType == 'yesterday') {
        this.searchForm.From = moment().subtract(1, 'days').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'days').format('YYYY-MM-DD');
      } else if (this.dateType == 'thisWeek') {
        this.searchForm.From = moment().startOf('week').format('YYYY-MM-DD');
        this.searchForm.To = moment().endOf('week').format('YYYY-MM-DD');
      } else if (this.dateType == 'lastWeek') {
        this.searchForm.From = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
      } else if (this.dateType == 'thisMonth') {
        this.searchForm.From = moment().startOf('month').format('YYYY-MM-DD');
        this.searchForm.To = moment().endOf('month').format('YYYY-MM-DD');
      } else if (this.dateType == 'lastMonth') {
        this.searchForm.From = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      } else if (this.dateType == 'thisYear') {
        this.searchForm.From = moment().startOf('year').format('YYYY-MM-DD');
        this.searchForm.To = moment().endOf('year').format('YYYY-MM-DD');
      } else if (this.dateType == 'lastYear') {
        this.searchForm.From = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
        this.searchForm.To = moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD');
      }
      this.searchForm.dateRange = [moment(this.searchForm.From).toDate(), moment(this.searchForm.To).toDate()];
      this.searchForm.page = 1;
      //this.getItems();
    },
    onSearch() {
      this.getItems();
    },
    disabledDate(time: Date) {
      return time.getTime() > Date.now() || time.getTime() < moment().add(-1, 'd').add(-6, 'M').toDate().getTime();
    },
    daterangeChange() {
      this.searchForm.dateRange;

      this.searchForm.From = moment(this.searchForm.dateRange[0]).format('YYYY-MM-DD');
      this.searchForm.To = moment(this.searchForm.dateRange[1]).format('YYYY-MM-DD');
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
</style>
