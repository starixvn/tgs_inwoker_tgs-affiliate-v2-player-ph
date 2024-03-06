<template>
  <el-card shadow="never" class="table">
    <el-row>
      <el-col :span="24">
        <div class="big-title">{{ $t('playerList') }}</div>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :md="18" :sm="24">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="searchForm.Username" :placeholder="$t('playerUsername')" size="large" clearable />
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

      <!--

  <el-col :md="6" :sm="24">
        <el-button type="primary" class="btnsearch" size="large" style="float: right" icon="mel-icon-plus"
          @click="addPlayerDialogVisible = true">{{ $t('addPlayer') }}</el-button>
      </el-col>

    -->
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-row style="margin-bottom: 5px">
          <el-col :span="24">
            <el-popover placement="left-start" :width="200" trigger="click"
              content="this is content, this is content, this is content">
              <template #reference>
                <el-button type="primary" class="btnsearch" size="large" style="float: right" icon="mel-icon-filter">
                </el-button>
              </template>

              <template #default>
                <div class="demo-rich-conent" style="display: flex; gap: 5px; flex-direction: column">
                  <el-checkbox v-model="isAllColumnsChecked" @change="toggleAllColumns">{{
        $t('checkAll')
      }}</el-checkbox>
                  <el-checkbox v-for="(item, index) in tableColumn" :key="index" :label="$t(index)"
                    :disabled="item.mustShow" v-model="item.isShow" />
                </div>
              </template>
            </el-popover>
          </el-col>
        </el-row>
        <el-table :data="tableData" border class="test">
          <el-table-column :label="t('player')" prop="username" min-width="150" />
          <el-table-column :label="t('playercode')" prop="playercode" v-if="tableColumn.playercode.isShow" />
          <el-table-column :label="t('viplevel')" prop="viplevel" align="center" width="90"
            v-if="tableColumn.viplevel.isShow" />
          <el-table-column :label="t('areacode')" prop="areacode" v-if="tableColumn.areacode.isShow" />
          <el-table-column :label="t('phone')" prop="phone" v-if="tableColumn.phone.isShow" />
          <el-table-column :label="t('registeredtime')" prop="registeredtime" :formatter="formatDateTime" width="180"
            v-if="tableColumn.registeredtime.isShow" />
          <el-table-column :label="t('lastloginon')" prop="lastloginon" :formatter="formatDateTime" width="180"
            v-if="tableColumn.lastloginon.isShow" />

          <el-table-column :label="t('balance')" align="center" width="150">

            <template #default="scope">
              <el-popover trigger="click" placement="left" :width="350">
                <template #reference>
                  <el-button link type="primary" size="small" @click="onClickBalance(scope.row)">
                    [{{ t('viewBalance') }}]
                  </el-button>
                </template>
                <div>
                  <el-row style="margin-bottom: 0px">
                    <el-col :span="24">
                      <span class="title">{{ t('balance') }}</span>
                    </el-col>
                  </el-row>
                  <el-row style="margin-bottom: 0px">
                    <el-col :span="24">
                      <el-form :label-width="170" label-position="left">
                        <el-form-item :label="t('username') + ':'" class="balance-item">
                          {{ playerBalance.username }}
                        </el-form-item>
                        <el-form-item :label="t('balance') + ':'" class="balance-item">
                          {{ playerBalance.balance }}
                        </el-form-item>
                        <el-form-item :label="t('wagering') + ':'" class="balance-item">
                          {{ playerBalance.wagering }}
                        </el-form-item>
                      </el-form>
                    </el-col>
                  </el-row>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column :label="t('totaldepositamount')" :formatter="formatPrice" prop="totaldepositamount"
            align="right" width="150" v-if="tableColumn.totaldepositamount.isShow"></el-table-column>
          <el-table-column :label="t('totalwithdrawamount')" :formatter="formatPrice" prop="totalwithdrawamount"
            align="right" width="150" v-if="tableColumn.totalwithdrawamount.isShow"></el-table-column>
          <el-table-column :label="t('status')" prop="status" align="center" :formatter="formatStatus"
            v-if="tableColumn.status.isShow" />

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
    <el-dialog v-model="addPlayerDialogVisible" :title="t('addPlayer')" :fullscreen="globalStore.isMobile">
      <el-form label-position="right" label-width="25%" style="width: 100%">
        <el-form-item :label="t('username')" required>
          <el-input v-model="addPlayerParams.username" size="large" :placeholder="$t('usernameFormat')" clearable />
        </el-form-item>
        <el-form-item :label="t('password')" required>
          <el-input v-model="addPlayerParams.password" size="large" :placeholder="$t('enterPassword')" clearable
            type="password" />
        </el-form-item>
        <el-form-item :label="t('confirmPassword')" required>
          <el-input v-model="addPlayerParams.confirmPassword" size="large" :placeholder="$t('reEnterPassword')"
            clearable type="password" />
        </el-form-item>
        <!--

 <el-form-item :label="t('phone')" required>
          <el-input v-model="addPlayerParams.phone" size="large" :placeholder="t('phoneFormat')" :type="number"
            :minlength="8" :maxlength="32">
            <template #prepend>
              <el-select v-model="addPlayerParams.areaCode" placeholder="Select" style="width: 100px" size="large">
                <el-option label="+84" value="84" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="t('email')" required>
          <el-input v-model="addPlayerParams.email" size="large" :placeholder="$t('enterEmail')" clearable />
        </el-form-item>


       -->
        <div class="tnc">
          <div class="tnc-checkbox">
            <el-checkbox v-model="addPlayerParams.tnc" size="large" />
          </div>

          <div class="tnc-content">
            {{ t('registerPlayerCondition') }}
          </div>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="addPlayerParams.username === '' ||
        addPlayerParams.password === '' ||
        addPlayerParams.confirmPassword !== addPlayerParams.password ||
        //  addPlayerParams.phone === '' ||
        //  addPlayerParams.phone.length < 6 ||
        //  addPlayerParams.phone.length > 32 ||
        addPlayerParams.tnc === false
        //  addPlayerParams.email === ''
        " @click="onAddPlayer()">
            {{ t('registerNow') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import moment from 'moment';
import type { TableColumnCtx } from 'element-plus';
import {
  getPlayerList,
  getPlayerStatuses,
  PlayerStatusData,
  PlayerData,
  GetPlayerListParams,
  getPlayerBalanceApi,
  getPlayerWageringApi,
  AddPlayerParams,
  CheckConditionParams,
  AddPlayerPhoneParams,
  AddPlayerEmailParams,
  checkConditionApi,
  addPlayerApi,
  addPlayerEmailApi,
  addPlayerPhoneApi,
} from '@/api/player';
import formatNumber from 'format-number';
import { useGlobalStore } from '@/store';
import { router } from '@/router';
import { table } from 'console';

interface PlayerDataColumn {
  player: {
    isShow: boolean;
    mustShow: boolean;
  };
  playercode: {
    isShow: boolean;
    mustShow: boolean;
  };
  viplevel: {
    isShow: boolean;
    mustShow: boolean;
  };
  areacode: {
    isShow: boolean;
    mustShow: boolean;
  };
  phone: {
    isShow: boolean;
    mustShow: boolean;
  };
  registeredtime: {
    isShow: boolean;
    mustShow: boolean;
  };
  lastloginon: {
    isShow: boolean;
    mustShow: boolean;
  };

  balance: {
    isShow: boolean;
    mustShow: boolean;
  };
  totaldepositamount: {
    isShow: boolean;
    mustShow: boolean;
  };
  totalwithdrawamount: {
    isShow: boolean;
    mustShow: boolean;
  };
  status: {
    isShow: boolean;
    mustShow: boolean;
  };
}

export default defineComponent({
  name: 'MyComponent',
  props: ['perform'],
  setup() {
    const globalStore = useGlobalStore();
    const { t } = useI18n();
    return {
      t,
      globalStore,
    };
  },

  data() {
    return {
      isAllColumnsChecked: false,
      showAgent: false,
      tableData: reactive<PlayerData[]>([]),
      statuses: reactive<PlayerStatusData>({}),
      totalRowCount: 0,
      addPlayerDialogVisible: this.perform === 'add',
      addPlayerParams: reactive(new AddPlayerParams()),
      tableColumn: reactive<PlayerDataColumn>({
        player: {
          isShow: true,
          mustShow: true,
        },
        playercode: {
          isShow: false,
          mustShow: false,
        },
        viplevel: {
          isShow: true,
          mustShow: false,
        },
        areacode: {
          isShow: false,
          mustShow: false,
        },
        phone: {
          isShow: false,
          mustShow: false,
        },
        registeredtime: {
          isShow: true,
          mustShow: false,
        },
        lastloginon: {
          isShow: true,
          mustShow: false,
        },

        balance: {
          isShow: true,
          mustShow: true,
        },
        totaldepositamount: {
          isShow: true,
          mustShow: false,
        },
        totalwithdrawamount: {
          isShow: true,
          mustShow: false,
        },
        status: {
          isShow: true,
          mustShow: false,
        },
      }),
      playerBalance: {
        balanceVisible: false,
        username: '--',
        balance: '0.00',
        wagering: '0.00',
      },
      searchForm: reactive<GetPlayerListParams>({
        BeginRegisteredOn: '',
        EndRegisteredOn: '',
        RegisterHost: '',
        Status: '',
        Username: '',
        VipId: '',
        page: 1,
        rows: 10,
        desc: true,
        sort: '',
        all: false,
      }),
    };
  },

  beforeMount() {
    this.getItems();
    this.getStatuses();
  },
  mounted() { },
  watch: {
    tableColumn: {
      deep: true,
      handler(newValue) {
        const allColumnsChecked = Object.values(newValue).every((item) => item.isShow);

        this.isAllColumnsChecked = allColumnsChecked;
      },
    },
  },
  methods: {
    toggleAllColumns() {
      // Loop through all tableColumn items and set their isShow property based on the state of isAllColumnsChecked
      for (const key in this.tableColumn) {
        if (Object.hasOwnProperty.call(this.tableColumn, key)) {
          this.tableColumn[key].isShow = this.isAllColumnsChecked;
        }
      }
    },
    async getItems() {
      const response = await getPlayerList();
      const result = await response.runAsync(this.searchForm);
      this.tableData = result.data.items;
      this.totalRowCount = result.data.totalcount;
    },

    async getStatuses() {
      const status = await getPlayerStatuses();
      const statusResult = await status.runAsync();

      this.statuses = statusResult.data;
    },

    formatStatus(row: any, column: TableColumnCtx<PlayerData>) {
      if (this.statuses[row[column.property]]) {
        return this.t(this.statuses[row[column.property]]);
      } else {
        return '';
      }
    },

    formatDateTime(row: any, column: TableColumnCtx<PlayerData>) {
      if (row[column.property]) {
        return moment(row[column.property]).format('YYYY-MM-DD HH:mm:ss');
      } else {
        return '';
      }
    },

    formatPrice(row: any, column: TableColumnCtx<PlayerData>) {
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

    onSearch() {
      this.getItems();
    },
    async onAddPlayer() {
      //check phone number length if less than 6 show error and only contain number
      //  if (this.addPlayerParams.phone.length < 6 || isNaN(Number(this.addPlayerParams.phone))) {
      //    ElMessage.error(this.t('invalidPhoneFormat'));
      //    return;
      //  }

      //check username and must contain only 6-16alphanumberic
      if (!/^[a-zA-Z0-9]{6,16}$/.test(this.addPlayerParams.username)) {
        ElMessage.error(this.t('invalidUsername'));
        return;
      }

      //check email must be email format
      //  if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(this.addPlayerParams.email)) {
      //    ElMessage.error(this.t('invalidEmailFormat'));
      //    return;
      //  }

      let param = new CheckConditionParams();
      param.username = this.addPlayerParams.username;
      param.data.areacode = this.addPlayerParams.areaCode;
      param.data.email = this.addPlayerParams.email;
      param.data.phone = this.addPlayerParams.phone;
      const res = await checkConditionApi()(param);
      if (res.data === true) {
        const resCreate = await addPlayerApi()(this.addPlayerParams);

        if (resCreate.err === 0) {
          let paramAddPhone = new AddPlayerPhoneParams();
          let paramAddEmail = new AddPlayerEmailParams();
          paramAddPhone.areaCode = this.addPlayerParams.areaCode;
          paramAddPhone.playercode = resCreate.data;
          paramAddPhone.phone = this.addPlayerParams.phone;
          paramAddEmail.email = this.addPlayerParams.email;
          paramAddEmail.playercode = resCreate.data;

          const resAddPhone = await addPlayerPhoneApi()(paramAddPhone);
          const resAddEmail = await addPlayerEmailApi()(paramAddEmail);
          if (resAddPhone.err === 0 && resAddEmail.err === 0) {
            this.addPlayerDialogVisible = false;
          }
        }
      }
    },
    async onClickBalance(playerData: PlayerData) {
      this.playerBalance.wagering = '0.00';
      this.playerBalance.balance = '0.00';
      this.playerBalance.username = '--';
      const res = await getPlayerBalanceApi();
      const result = await res.runAsync(playerData.playercode);
      this.playerBalance.balance = formatNumber({ truncate: 2, padRight: 2 })(result.data);
      const res2 = await getPlayerWageringApi();
      const result2 = await res2.runAsync(playerData.playercode);
      this.playerBalance.wagering = formatNumber({ truncate: 2, padRight: 2 })(result2.data);
      this.playerBalance.username = playerData.username;
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

<style>
.balance-item {
  margin-bottom: 0px;
}

.balance-item .el-form-item__label {
  height: 25px;
  line-height: 25px;
}

.balance-item .el-form-item__content {
  height: 25px;
  line-height: 25px;
}
</style>

<style lang="scss" scoped>
.tnc {
  display: flex;
  align-items: center;

  .tnc-checkbox {
    padding-right: 16px;
    width: 25%;
    display: inline-flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  .tnc-content {
    display: inline-flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding-right: 20px;
  }
}

.title {
  font-weight: bold;
  line-height: 30px;
}

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

<style>
.el-checkbox.el-checkbox--large {
  background-image: url(/assets/images/uncheckbox.png);
  background-repeat: no-repeat;
  background-size: contain;
  width: 20px;
  height: 20px;
}

.el-checkbox.el-checkbox--large.is-checked {
  background-image: url(/assets/images/checkbox.png);
}

.el-checkbox-button.is-checked .el-checkbox-button__inner {
  color: var(--el-checkbox-button-checked-text-color);
  background-color: #208eff;
  border-color: var(--el-checkbox-button-checked-border-color);
  box-shadow: -1px 0 0 0 var(--el-color-primary-light-7);
}

.el-checkbox.el-checkbox--large .el-checkbox__inner {
  display: none;
}

.el-table__header thead tr th {
  text-align: center !important;
}
</style>
