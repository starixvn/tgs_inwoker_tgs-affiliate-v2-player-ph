<template>
  <el-card shadow="never" class="table">
    <el-row>
      <el-col :span="24">
        <div class="big-title">{{ $t('agentList') }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :md="18" :sm="24">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="searchForm.Username" :placeholder="$t('agentusername')" size="large" clearable />
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.Status" class="modded-select" size="large" :placeholder="t('status')">
              <el-option :label="t('status')" value="" />
              <el-option v-for="(item, key) in statuses" :key="key" :label="t(item)" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="btnsearch" size="large" @click="onSearch()">{{ $t('search') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :md="6" :sm="24">
        <el-form :inline="true">
          <el-form-item style="margin-right: 0px; float: right">
            <el-button
              type="primary"
              class="btnsearch"
              size="large"
              style="float: right"
              icon="mel-icon-plus"
              @click="addAgentDialogVisible = true"
              >{{ $t('addagent') }}</el-button
            >
            <!-- <el-button type="primary" icon="mel-icon-filter" size="large"/> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" border resizable fit>
          <el-table-column :label="t('agent')" prop="username" min-width="150" align="center" />
          <el-table-column :label="t('type')" prop="type" :formatter="translateAgentType" align="center" />
          <el-table-column
            :label="t('profitSharePT')"
            prop="dividendpercentage"
            :formatter="formatPercentage"
            width="150"
            align="center"
          />
          <el-table-column
            v-if="userStore?.user?.agentdividendtype === 'MultipleLayer'"
            :label="t('profitShareConfig')"
            width="150"
            align="center"
          >
            <template #default="scope">
              <el-button type="primary" size="small" @click="getAgentDetailOnly(scope.row.id)">{{
                t('profitShareSetup')
              }}</el-button>
              <el-dialog
                v-if="viewAgentProfitShareDialogVisible === scope.row.id"
                v-model="viewAgentProfitShareDialogVisible"
                width="50%"
                :fullscreen="globalStore.isMobile"
                :title="t('profitShareConfig')"
                append-to-body
              >
                <el-table :data="agentDetails?.dividendconditions" border resizable fit>
                  <el-table-column :label="t('netprofit')" prop="netprofit" align="center" />
                  <el-table-column :label="t('activenumber')" prop="activenumber" align="center" />
                  <el-table-column :label="t('configdividendpercentage')" prop="dividendpercentage" align="center" />
                </el-table>
              </el-dialog>
            </template>
          </el-table-column>
          <el-table-column :label="t('teamnumber')" prop="teamnumber" width="130" align="center" />
          <el-table-column align="center" :label="t('balance')" prop="balance" :formatter="formatPrice" />
          <el-table-column
            :label="t('status')"
            prop="status"
            :formatter="formatStatus"
            min-width="120"
            align="center"
          />
          <el-table-column :label="t('setting')" align="center" width="150">
            <template #default="scope">
              <el-button type="primary" icon="mel-icon-search" size="small" @click="onViewClick(scope.row.id)" />
              <el-button type="primary" icon="mel-icon-edit" size="small" @click="onEditClick(scope.row.id)" />
            </template>
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
          :page-sizes="[10, 50, 200]"
          layout="sizes, prev, pager, next"
          :total="totalRowCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
    <el-dialog v-model="addAgentDialogVisible" :title="t('addagent')" :fullscreen="globalStore.isMobile">
      <el-form label-position="right" label-width="25%" style="width: 100%">
        <el-form-item :label="t('username')" required>
          <el-input v-model="addAgentParams.userName" size="large" :placeholder="$t('enterUsername')" clearable />
        </el-form-item>
        <el-form-item :label="t('password')" required>
          <el-input
            v-model="addAgentParams.password"
            size="large"
            :placeholder="$t('enterPassword')"
            clearable
            type="password"
          />
        </el-form-item>
        <el-form-item :label="t('confirmPassword')" required>
          <el-input
            v-model="addAgentParams.confirmPassword"
            size="large"
            :placeholder="$t('reEnterPassword')"
            clearable
            type="password"
          />
        </el-form-item>
        <el-form-item :label="t('realName')">
          <el-input v-model="addAgentParams.realname" size="large" :placeholder="$t('enterRealName')" clearable />
        </el-form-item>
        <el-form-item :label="t('email')" required>
          <el-input v-model="addAgentParams.email" size="large" :placeholder="$t('enterEmail')" clearable />
        </el-form-item>
        <el-form-item :label="t('profitSharePT')" required>
          <el-input-number
            v-model="addAgentParams.dividendPercentage"
            size="large"
            :placeholder="$t('enterProfitSharePT')"
            precision="2"
            style="width: 100%"
            @change="anotherProfitShareListener"
          >
            <template #append>%</template>
          </el-input-number>
          <el-alert type="error" :closable="false">
            {{ $t('dividentAlert', [userStore.user.dividendpercentage]) }}%
          </el-alert>
        </el-form-item>

        <el-form-item :label="t('remarks')">
          <el-input v-model="addAgentParams.remarks" size="large" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :disabled="
              addAgentParams.email === '' ||
              !addAgentParams.dividendPercentage ||
              (addAgentParams.dividendPercentage &&
                addAgentParams.dividendPercentage.toString().split('.')[1]?.length > 2)
            "
            @click="onRegister()"
          >
            {{ t('registerNow') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="viewAgentDialogVisible" :title="t('agentInfo')" width="80%" :fullscreen="globalStore.isMobile">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="t('agent')" name="first">
          <el-row>
            <el-col :lg="12" :md="12" :xs="24">
              <el-form label-position="right" label-width="150px">
                <el-form-item :label="t('agentusername') + ':'">
                  {{ agentDetails.username }}
                </el-form-item>
                <el-form-item :label="t('realName') + ':'">
                  {{ agentDetails.realname }}
                </el-form-item>
                <el-form-item :label="t('registeredOn') + ':'">
                  {{ formatDateTime2(agentDetails.registeredon) }}
                </el-form-item>
                <el-form-item :label="t('balance') + ':'">
                  {{ agentDetails.balance }}
                </el-form-item>
                <el-form-item :label="t('status') + ':'">
                  {{ t(agentDetails.status) }}
                </el-form-item>
                <el-form-item :label="t('type') + ':'">
                  {{ t(agentDetails.type) }}
                </el-form-item>
                <el-form-item :label="t('profitSharePT') + ':'"> {{ agentDetails.dividendpercentage }}% </el-form-item>
              </el-form>
            </el-col>
            <el-col :lg="12" :md="12" :xs="24">
              <el-form label-position="right" label-width="150px">
                <el-form-item :label="t('email') + ':'">
                  {{ agentDetails.email }}
                </el-form-item>
                <el-form-item :label="t('phone') + ':'">
                  {{ agentDetails.phone }}
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="t('balanceChangeRecord')" name="second">
          <el-row style="margin-bottom: 0px">
            <el-col :span="24">
              <el-form :inline="true">
                <el-form-item>
                  <el-select
                    v-model="accountChange.searchForm.transactiontype"
                    size="large"
                    style="width: 100%"
                    :placeholder="$t('transactionType')"
                  >
                    <el-option
                      v-for="(value, propertyName) in accountChange.transactionTypeList"
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
                  <el-radio-group v-model="accountChange.dateType" size="large" @change="onDateTypeChange">
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
                    v-model="accountChange.searchForm.dateRange"
                    type="daterange"
                    size="large"
                    :disabled-date="disabledDate"
                    @change="daterangeChange"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="btnsearch" size="large" @click="onSearchAccountChange()">{{
                    t('search')
                  }}</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table :data="accountChange.tableData" stripe>
                <el-table-column
                  :label="t('time')"
                  prop="recordedOn"
                  align="center"
                  :formatter="formatAgentChangeDateTime"
                >
                </el-table-column>
                <el-table-column
                  prop="transactionType"
                  :label="t('transactionType')"
                  align="center"
                  :formatter="formatTransactionType"
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
                v-model:current-page="accountChange.searchForm.page"
                v-model:page-size="accountChange.searchForm.rows"
                :page-sizes="[10, 50, 200]"
                layout="sizes, prev, pager, next"
                :total="accountChange.totalRowCount"
                @size-change="handleAccountChangeSizeChange"
                @current-change="handleAccountChangeCurrentChange"
              />
            </div>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      v-model="updateAgentDialogVisible"
      :title="t('agentInfo')"
      width="80%"
      :fullscreen="globalStore.isMobile"
    >
      <el-row>
        <el-col :lg="12" :md="12" :xs="24">
          <el-form label-position="right" label-width="150px">
            <el-form-item :label="t('agentusername') + ':'">
              {{ agentDetails.username }}
            </el-form-item>
            <el-form-item :label="t('realName') + ':'">
              {{ agentDetails.realname }}
              <el-button type="primary" style="margin-left: 10px" @click="onUpdateRealNameClick">{{
                t('updateRealName')
              }}</el-button>
              <el-dialog
                v-model="updateRealNameDialogVisible"
                width="30%"
                :fullscreen="globalStore.isMobile"
                :title="t('updateRealName')"
                append-to-body
              >
                <el-form label-position="right" label-width="150px">
                  <el-form-item :label="t('realName')">
                    <el-input
                      v-model="updateAgentParams.realName"
                      size="large"
                      :placeholder="$t('realName')"
                      clearable
                    />
                  </el-form-item>
                </el-form>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button type="primary" @click="onSubmitAgentRealNameClick">
                      {{ t('submit') }}
                    </el-button>
                  </div>
                </template>
              </el-dialog>
            </el-form-item>
            <el-form-item :label="t('registeredOn') + ':'">
              {{ formatDateTime2(agentDetails.registeredon) }}
            </el-form-item>
            <el-form-item :label="t('balance') + ':'">
              {{ agentDetails.balance }}
            </el-form-item>
            <el-form-item :label="t('status') + ':'">
              {{ t(agentDetails.status) }}
            </el-form-item>
            <el-form-item :label="t('type') + ':'">
              {{ t(agentDetails.type) }}
            </el-form-item>
            <el-form-item :label="t('profitSharePT') + ':'">
              {{ agentDetails.dividendpercentage.toFixed(2) }}%
              <el-button
                v-if="agentDetails.agentdividendtype === 'OneLayer'"
                type="primary"
                style="margin-left: 10px"
                @click="onUpdateProfitSharePTClick"
                >{{ t('updateProfitSharePT') }}</el-button
              >
              <el-dialog
                v-model="updateProfitSharePTDialogVisible"
                width="30%"
                :fullscreen="globalStore.isMobile"
                :title="t('updateProfitSharePT')"
                append-to-body
              >
                <el-form label-position="left" label-width="150px">
                  <el-form-item :label="t('profitSharePT')">
                    <el-input-number
                      v-model="updateDividendParams.dividendPercentage"
                      size="large"
                      :placeholder="$t('enterProfitSharePT')"
                      precision="2"
                      style="width: 80%"
                      @change="profitShareListener"
                    />
                    <div style="text-align: center; width: 80%">
                      {{ t('profitShareCannotExceed', { percentage: agentDividendRange.max }) }}
                    </div>
                  </el-form-item>
                </el-form>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button
                      type="primary"
                      :disabled="
                        updateDividendParams.dividendPercentage > agentDividendRange.max ||
                        (updateDividendParams.dividendPercentage &&
                          updateDividendParams.dividendPercentage.toString().split('.')[1]?.length > 2)
                      "
                      @click="onSubmitUpdateProfitSharePTClick"
                    >
                      {{ t('submit') }}
                    </el-button>
                  </div>
                </template>
              </el-dialog>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :lg="12" :md="12" :xs="24">
          <el-form label-position="right" label-width="150px">
            <el-form-item :label="t('email') + ':'">
              <el-input v-model="agentDetails.email"></el-input>
            </el-form-item>
            <el-form-item :label="t('phone') + ':'">
              <el-input v-model="agentDetails.phone"></el-input>
            </el-form-item>
            <el-form-item :label="t('password') + ':'">
              <el-button type="primary" @click="onResetPasswordClick">{{ t('resetPassword') }}</el-button>
              <el-dialog
                v-model="resetPasswordDialogVisible"
                width="50%"
                :fullscreen="globalStore.isMobile"
                :title="t('resetPassword')"
                append-to-body
              >
                <el-form label-position="right" label-width="150px">
                  <el-form-item :label="t('password')" required>
                    <el-input
                      v-model="updateAgentPasswordParams.password"
                      size="large"
                      :placeholder="$t('enterPassword')"
                      clearable
                      type="password"
                    />
                  </el-form-item>
                  <el-form-item :label="t('confirmPassword')" required>
                    <el-input
                      v-model="updateAgentPasswordParams.confirmPassword"
                      size="large"
                      :placeholder="$t('reEnterPassword')"
                      clearable
                      type="password"
                    />
                  </el-form-item>
                </el-form>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button type="primary" @click="onUpdateAgentPasswordClick">
                      {{ t('submit') }}
                    </el-button>
                  </div>
                </template>
              </el-dialog>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onUpdateAgentContactClick">
            {{ t('submit') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import moment from 'moment';
import { useGlobalStore } from '@/store';
import { useUserStore } from '@/store';
import type { TableColumnCtx } from 'element-plus';
import {
  getAgentList,
  getAgentStatusesApi,
  AgentStatusesData,
  GetAgentListParams,
  AgentData,
  getAgentDetailsApi,
  AgentDetailsData,
} from '@/api/reports';
import {
  accountChangesApi,
  AccountChangesItems,
  AccountChangesParams,
  getTransactionTypeApi,
  TransactionTypeData,
} from '@/api/agentreport';
import {
  AddAgentParams,
  addAgentApi,
  getSubAgentDividendsApi,
  UpdateDividendParams,
  updateDividendApi,
  GetSubAgentDividendData,
  updateAgentApi,
  UpdateAgentParams,
  UpdateAgentContactParams,
  updateAgentPasswordApi,
  updateAgentContactApi,
  UpdateAgentPasswordParams,
  checkAgentExistApi,
} from '@/api/agent';

export default defineComponent({
  name: 'MyComponent',
  props: ['perform'],
  setup() {
    const { t } = useI18n();
    const globalStore = useGlobalStore();
    const userStore = useUserStore();
    return {
      t,
      globalStore,
      userStore,
    };
  },

  data() {
    return {
      accountChange: {
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
      },
      showAgent: false,
      tableData: reactive<AgentData[]>([]),
      statuses: reactive<AgentStatusesData>({}),
      totalRowCount: 0,
      activeName: 'first',
      addAgentDialogVisible: this.perform === 'add',
      viewAgentDialogVisible: false,
      viewAgentProfitShareDialogVisible: '',
      updateAgentDialogVisible: false,
      resetPasswordDialogVisible: false,
      updateRealNameDialogVisible: false,
      updateProfitSharePTDialogVisible: false,
      updateAgentId: '',
      agentDividendRange: reactive<GetSubAgentDividendData>({
        min: 0,
        max: 0,
      }),
      agentDetails: reactive<AgentDetailsData>({
        accumulatedprofitsharing: 0,
        agentdividendtype: '',
        agentdomains: '',
        agentlevel: 0,
        brandUrl: '',
        dividendconditions: '',
        email: '',
        invitationCode: '',
        issetpaypassword: false,
        parentusername: '',
        phone: '',
        playernumber: 0,
        qq: '',
        realname: '',
        wechat: '',
        agentstatus: '',
        balance: 0,
        cardgamerebatepercentage: 0,
        commissionpercentage: 0,
        dividendpercentage: 0,
        id: '',
        leveltype: '',
        livedealerrebatepercentage: 0,
        lotteryrebatepercentage: 0,
        registeredon: '',
        slotrebatepercentage: 0,
        sportsrebatepercentage: 0,
        status: '',
        teamnumber: 1,
        type: '',
        username: '',
        virtualsportsrebatepercentage: 0,
      }),
      addAgentParams: reactive(new AddAgentParams()),
      updateAgentPasswordParams: reactive(new UpdateAgentPasswordParams()),
      updateAgentParams: reactive(new UpdateAgentParams()),
      updateAgentContactParams: reactive(new UpdateAgentContactParams()),
      updateDividendParams: reactive(new UpdateDividendParams()),
      searchForm: reactive<GetAgentListParams>({
        page: 1,
        rows: 10,
        desc: false,
        sort: '',
        all: false,
        Status: '',
        Username: '',
      }),
    };
  },
  beforeMount() {
    this.getItems();
    this.getStatuses();
    this.onDateTypeChange();
    this.getTransactionType();
  },

  methods: {
    profitShareListener(value: number) {
      if (value) {
        if (value.toString().split('.')[1]?.length > 2) {
          this.updateDividendParams.dividendPercentage = parseFloat(value.toFixed(2));
        }

        if (value > this.agentDividendRange.max) {
          ElMessageBox.alert(this.t('profitShareCannotExceed', { percentage: this.agentDividendRange.max }), {
            confirmButtonText: this.t('close'),
          });

          this.updateDividendParams.dividendPercentage = this.agentDividendRange.max;
        }
        if (value < 0) {
          this.updateDividendParams.dividendPercentage = 0;
          ElMessageBox.alert(this.t('valueCannotLesserThanZero', { percentage: this.agentDividendRange.max }), {
            confirmButtonText: this.t('close'),
          });
        }
      } else {
        this.updateDividendParams.dividendPercentage = 0;
      }
    },

    anotherProfitShareListener(value: number) {
      const userDividendPercentage = this.userStore.user.dividendpercentage;

      if (value.toString().split('.')[1]?.length > 2) {
        this.addAgentParams.dividendPercentage = parseFloat(value.toFixed(2));
      }

      if (value > userDividendPercentage) {
        ElMessageBox.alert(this.t('profitShareCannotExceed', { percentage: userDividendPercentage }), {
          confirmButtonText: this.t('close'),
        });

        this.addAgentParams.dividendPercentage = userDividendPercentage;
      }
      if (value < 0) {
        this.updateDividendParams.dividendPercentage = 0;
        ElMessageBox.alert(this.t('valueCannotLesserThanZero', { percentage: userDividendPercentage }), {
          confirmButtonText: this.t('close'),
        });
      }
    },

    async getItems() {
      const response = await getAgentList();
      const result = await response.runAsync(this.searchForm);
      this.tableData = [...result.data.items];
      this.totalRowCount = result.data.totalCount;
    },

    async getStatuses() {
      const status = await getAgentStatusesApi();
      const statusResult = await status.runAsync();

      this.statuses = statusResult.data;
    },
    async getTransactionType() {
      const response = await getTransactionTypeApi();
      const result = await response.runAsync();
      this.accountChange.transactionTypeList = result.data;
    },
    formatStatus(row: any, column: TableColumnCtx<AgentData>) {
      return this.t(row[column.property]);
    },

    translateAgentType(row: any, column: TableColumnCtx<AgentData>) {
      return this.t(row[column.property]);
    },
    formatDateTime(row: any, column: TableColumnCtx<AgentData>) {
      return this.formatDateTime2(row[column.property]);
    },
    formatAgentChangeDateTime(row: any, column: TableColumnCtx<AccountChangesItems>) {
      return this.formatDateTime2(row[column.property]);
    },
    formatTransactionType(row: any, column: TableColumnCtx<AccountChangesItems>) {
      const transactionType = this.accountChange.transactionTypeList[row[column.property]];
      return this.$t(transactionType ?? '');
    },
    formatDateTime2(value: string) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
    formatPrice(row: any, column: TableColumnCtx<AgentData>) {
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
    formatPercentage(row: any, column: TableColumnCtx<AgentData>) {
      let percentage = '%' as string;
      return row[column.property] + percentage;
    },
    disabledDate(time: Date) {
      return time.getTime() > Date.now() || time.getTime() < moment().add(-1, 'd').add(-6, 'M').toDate().getTime();
    },
    daterangeChange() {
      this.accountChange.searchForm.From = moment(this.accountChange.searchForm.dateRange[0]).format('YYYY-MM-DD');
      this.accountChange.searchForm.To = moment(this.accountChange.searchForm.dateRange[1]).format('YYYY-MM-DD');
    },
    onDateTypeChange() {
      if (this.accountChange.dateType == 'today') {
        this.accountChange.searchForm.From = moment().format('YYYY-MM-DD');
        this.accountChange.searchForm.To = moment().format('YYYY-MM-DD');
      } else if (this.accountChange.dateType == 'yesterday') {
        this.accountChange.searchForm.From = moment().subtract(1, 'days').format('YYYY-MM-DD');
        this.accountChange.searchForm.To = moment().subtract(1, 'days').format('YYYY-MM-DD');
      } else if (this.accountChange.dateType == 'thisWeek') {
        this.accountChange.searchForm.From = moment().startOf('week').format('YYYY-MM-DD');
        this.accountChange.searchForm.To = moment().endOf('week').format('YYYY-MM-DD');
      } else if (this.accountChange.dateType == 'lastWeek') {
        this.accountChange.searchForm.From = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        this.accountChange.searchForm.To = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
      } else if (this.accountChange.dateType == 'thisMonth') {
        this.accountChange.searchForm.From = moment().startOf('month').format('YYYY-MM-DD');
        this.accountChange.searchForm.To = moment().endOf('month').format('YYYY-MM-DD');
      } else if (this.accountChange.dateType == 'lastMonth') {
        this.accountChange.searchForm.From = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        this.accountChange.searchForm.To = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      } else if (this.accountChange.dateType == 'thisYear') {
        this.accountChange.searchForm.From = moment().startOf('year').format('YYYY-MM-DD');
        this.accountChange.searchForm.To = moment().endOf('year').format('YYYY-MM-DD');
      } else if (this.accountChange.dateType == 'lastYear') {
        this.accountChange.searchForm.From = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
        this.accountChange.searchForm.To = moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD');
      }
      this.accountChange.searchForm.dateRange = [
        moment(this.accountChange.searchForm.From).toDate(),
        moment(this.accountChange.searchForm.To).toDate(),
      ];
      this.accountChange.searchForm.page = 1;
      //this.getItems();
    },
    onStatusChange(value: string) {
      this.searchForm.Status = value;
    },
    onSearch() {
      this.getItems();
    },
    resetEverything() {
      this.activeName = 'first';
      this.accountChange.searchForm.From = '';
      this.accountChange.searchForm.To = '';
      this.accountChange.searchForm.dateRange = [new Date(), new Date()];
      this.accountChange.searchForm.page = 1;
      this.accountChange.searchForm.rows = 10;
      this.accountChange.tableData = [];
      this.accountChange.totalRowCount = 0;
      this.accountChange.dateType = 'today';
    },
    onSearchAccountChange() {
      this.getAccountChange();
    },
    async onViewClick(id: string) {
      this.resetEverything();
      const response = await getAgentDetailsApi();
      const result = await response.runAsync(id);

      this.agentDetails = result.data;
      this.viewAgentDialogVisible = true;
    },
    async getAgentDetailOnly(id: string) {
      this.resetEverything();
      const response = await getAgentDetailsApi();
      const result = await response.runAsync(id);
      this.agentDetails = result.data;
      this.viewAgentProfitShareDialogVisible = id;
    },
    async onEditClick(id: string) {
      this.updateAgentId = id;
      const response = await getAgentDetailsApi();
      const result = await response.runAsync(id);
      this.agentDetails = result.data;

      const response2 = await getSubAgentDividendsApi();
      const result2 = await response2.runAsync(id);
      this.agentDividendRange = result2.data;
      this.updateAgentDialogVisible = true;
    },
    async onUpdateAgentContactClick() {
      //check if email is valid
      if (this.agentDetails.email !== '') {
        const emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
        if (!emailRegex.test(this.agentDetails.email)) {
          ElMessage.error(this.$t('invalidEmailFormat'));
          return;
        }
      }

      const params = new UpdateAgentContactParams();
      params.email = this.agentDetails.email;
      params.phone = this.agentDetails.phone;
      params.subAgentId = this.updateAgentId;
      const response = await updateAgentContactApi()(params);
      if (response.err === 0) {
        this.updateAgentDialogVisible = false;
      }
    },
    async onUpdateAgentPasswordClick() {
      this.updateAgentPasswordParams.subAgentId = this.updateAgentId;
      const response = await updateAgentPasswordApi()(this.updateAgentPasswordParams);
      if (response.err === 0) {
        this.resetPasswordDialogVisible = false;
      }
    },

    async onRegister() {
      if (this.addAgentParams.userName === '') {
        ElMessage.error(this.$t('usernameCannotEmpty'));
        return;
      }
      if (this.addAgentParams.password === '') {
        ElMessage.error(this.$t('passwordCannotEmpty'));
        return;
      }

      //check for email regex
      if (this.addAgentParams.email !== '') {
        const emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
        if (!emailRegex.test(this.addAgentParams.email)) {
          ElMessage.error(this.$t('invalidEmailFormat'));
          return;
        }
      }

      const passwordRegex = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$');
      if (!passwordRegex.test(this.addAgentParams.password)) {
        ElMessage.error(this.$t('mustMatchPasswordFormat'));
        return;
      }
      if (this.addAgentParams.confirmPassword !== this.addAgentParams.password) {
        ElMessage.error(this.$t('passwordNotSame'));
        return;
      }

      if (this.addAgentParams.dividendPercentage > this.userStore.user.dividendpercentage) {
        ElMessage.error(this.$t('dividentAlert', [this.userStore.user.dividendpercentage]) + '%');
        return;
      }
      // if(this.addAgentParams.realname === ''){
      //   ElMessage.error(this.$t('plsEnterRealName'));
      //   return;
      // }
      // if(this.addAgentParams.remarks === ''){
      //   ElMessage.error(this.$t('plsEnterRemark'));
      //   return;
      // }

      const res2 = await checkAgentExistApi(this.addAgentParams.userName);
      if (!res2.isexist) {
        const res = await addAgentApi()(this.addAgentParams);
        this.getItems();
        this.resetAddAgent();
        this.addAgentDialogVisible = false;
      } else {
        ElMessage.error(this.$t('usernameAlreadyExist'));
      }
    },
    onResetPasswordClick() {
      this.resetPasswordDialogVisible = true;
      this.updateAgentPasswordParams = new UpdateAgentPasswordParams();
    },

    onUpdateProfitSharePTClick() {
      this.updateProfitSharePTDialogVisible = true;
      this.updateDividendParams = new UpdateDividendParams();
      this.updateDividendParams.dividendPercentage = this.agentDetails.dividendpercentage;
      this.updateDividendParams.subAgentId = this.updateAgentId;
    },
    async onSubmitUpdateProfitSharePTClick() {
      const response = await updateDividendApi()(this.updateDividendParams);
      if (response.err === 0) {
        this.agentDetails.dividendpercentage = this.updateDividendParams.dividendPercentage;
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id === this.updateAgentId) {
            this.tableData[i].dividendpercentage = this.updateDividendParams.dividendPercentage;
            break;
          }
        }

        this.updateProfitSharePTDialogVisible = false;
      }
    },
    onUpdateRealNameClick() {
      this.updateRealNameDialogVisible = true;
      this.updateAgentParams = new UpdateAgentParams();
      this.updateAgentParams.realName = this.agentDetails.realname;
      this.updateAgentParams.subAgentId = this.updateAgentId;
    },
    async onSubmitAgentRealNameClick() {
      const response = await updateAgentApi()(this.updateAgentParams);
      if (response.err === 0) {
        this.agentDetails.realname = this.updateAgentParams.realName;
        this.updateRealNameDialogVisible = false;
      }
    },
    resetAddAgent() {
      this.addAgentParams = new AddAgentParams();
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
    handleAccountChangeSizeChange(val: number) {
      this.accountChange.searchForm.rows = val;
      this.accountChange.searchForm.page = 1;
      this.getAccountChange();
    },
    handleAccountChangeCurrentChange(val: number) {
      this.accountChange.searchForm.page = val;
      this.getAccountChange();
    },
    async getAccountChange() {
      this.accountChange.searchForm.id = this.agentDetails.id;
      let searchForm = { ...this.accountChange.searchForm };
      searchForm.From = moment(searchForm.From).add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');

      searchForm.To = moment(searchForm.To).add(1, 'days').add(-8, 'hours').format('YYYY-MM-DD HH:mm:ss');
      const response = await accountChangesApi();
      const result = await response.runAsync(searchForm);
      this.accountChange.tableData = result.data.items;

      this.accountChange.totalRowCount = result.data.totalcount;
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

.btn {
  background: transparent;
  color: var(--el-input-border-color);
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border: none;
}

.empty-row {
  background-color: #000000;
}

.subtotal-row {
  background-color: #000000;
}

.button-form {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
