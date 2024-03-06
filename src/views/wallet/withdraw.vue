<template>
  <div>
    <div class="big-title">{{ $t('withdraw') }}</div>
    <el-row :gutter="20">
      <el-col :xl="6" :lg="6" :md="8" :sm="8" :xs="24">
        <div class="balance boxshadow">
          <div class="user-balance">
            <span class="balance-label">{{ t('balance') }}</span
            ><br />
            {{ formatNumber({ truncate: 2, padRight: 2 })(userStore.user.balance) }}
          </div>
        </div>
      </el-col>
      <el-col :xl="12" :lg="12" :md="8" :sm="16" :xs="24">
        <div class="sub-title">{{ $t('withdraw') }}</div>
        <el-form label-width="auto" label-position="left" style="margin-top: 10px">
          <el-form-item :label="t('bankCard')">
            <el-select
              v-model="withdrawalParams.bankinfoid"
              size="large"
              style="width: 100%"
              :placeholder="bankInfoList.length > 0 ? $t('select') : $t('plsSelectBankCard')"
              @change="onCardChange()"
            >
              <el-option
                v-for="(bankInfo, key) in bankInfoList"
                :key="key"
                :label="formatLabel(bankInfo)"
                :value="bankInfo.id"
              />
            </el-select>
          </el-form-item>
          <el-space fill style="width: 100%">
            <el-form-item :label="t('amount')" class="withdraw-amount-item">
              <el-input-number
                v-model="withdrawalParams.amount"
                :precision="2"
                :step="1"
                :max="maxWithdrawal"
                :min="minWithdrawal"
                size="large"
                :placeholder="'Enter withdraw amount'"
                style="width: 100%"
              />
            </el-form-item>
            <el-alert type="warning" show-icon :closable="false" class="withdraw-amount-alert">
              <p>{{ t('withdrawalRange', [minWithdrawal, maxWithdrawal]) }}</p>
            </el-alert>
          </el-space>

          <el-form-item :label="t('withdrawpassword')">
            <el-input
              v-model="withdrawalParams.paypassword"
              size="large"
              :placeholder="$t('enterWithdrawPassword')"
              clearable
              type="password"
              show-password
            >
            </el-input>
          </el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            size="large"
            :disabled="
              withdrawalParams.amount <= 0 || withdrawalParams.bankinfoid == '' || withdrawalParams.paypassword == ''
            "
            @click="onSubmit"
            >{{ $t('submit').toUpperCase() }}</el-button
          >
        </el-form>
      </el-col>
      <el-col :xl="6" :lg="6" :md="8" :sm="24" :xs="24">
        <el-form class="bank-details" label-position="right" label-width="50%" style="width: 100%">
          <el-form-item v-if="selectedbankInfo.banktype !== '--'" :label="t('type')" class="label-bold">
            <span>{{ t(selectedbankInfo.banktype) }}</span>
          </el-form-item>
          <el-form-item v-if="selectedbankInfo.banktype === 'Bank'" :label="t('bank')" class="label-bold">
            <span>{{ selectedbankInfo.detail.bankName }}</span>
          </el-form-item>
          <el-form-item v-if="selectedbankInfo.banktype === 'Bank'" :label="t('branch')" class="label-bold">
            <span>{{ selectedbankInfo.detail.bankBranch }}</span>
          </el-form-item>
          <el-form-item v-if="selectedbankInfo.banktype === 'Bank'" :label="t('accountName')" class="label-bold">
            <span>{{ selectedbankInfo.detail.name }}</span>
          </el-form-item>
          <el-form-item v-if="selectedbankInfo.banktype === 'Bank'" :label="t('accountNumber')" class="label-bold">
            <span>{{ selectedbankInfo.detail.bankAccount }}</span>
          </el-form-item>
          <el-form-item v-if="selectedbankInfo.banktype !== 'Bank'" :label="t('walletAddress')" class="label-bold">
            <span>{{ selectedbankInfo.detail.address }}</span>
          </el-form-item>

          <el-form-item v-if="selectedbankInfo.banktype !== 'Bank'" :label="t('channel')" class="label-bold">
            <span>{{
              addCardInfoList.filter((a) => a.channelid === selectedbankInfo.paymentchannelid).length > 0 &&
              addCardInfoList.filter((a) => a.channelid === selectedbankInfo.paymentchannelid)[0].channelcode
            }}</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <div class="sub-title">{{ $t('manageBankCard') }}</div>
      </el-col>
    </el-row>
    <el-space wrap style="margin-top: 10px">
      <div v-for="(bankInfo, key) in bankInfoList" :key="key" class="bank-card boxshadow">
        <div class="bank-card-header">
          <span>{{ t(bankInfo.banktype) }}</span>
          <el-button class="delete-btn" type="danger" icon="mel-icon-delete" circle @click="onDeleteCard(bankInfo)" />
        </div>
        <div class="bank-card-body">
          <div v-if="bankInfo.banktype === 'Crypto' || bankInfo.banktype === 'ThirdParty'">
            <div class="text item">
              {{
                addCardInfoList.filter((a) => a.channelid === bankInfo.paymentchannelid).length > 0 &&
                addCardInfoList.filter((a) => a.channelid === bankInfo.paymentchannelid)[0].channelcode
              }}
            </div>
          </div>

          <div v-if="bankInfo.banktype === 'Bank'">
            <div class="text item">{{ bankInfo.detail.bankName }} - {{ bankInfo.detail.bankBranch }}</div>
            <div class="text item">{{ bankInfo.detail.name }}</div>
            <div class="text item">
              {{ $t('endingIn') }}
              {{
                bankInfo.detail.bankAccount.substring(
                  bankInfo.detail.bankAccount.length - 4,
                  bankInfo.detail.bankAccount.length,
                )
              }}
            </div>
          </div>
          <div v-if="bankInfo.banktype !== 'Bank'">
            <div class="text item">
              {{ $t('endingIn') }}
              {{
                bankInfo.detail.address.substring(bankInfo.detail.address.length - 4, bankInfo.detail.address.length)
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="bank-card addnew">
        <div class="add">
          <el-button
            class="add-btn"
            type="primary"
            icon="mel-icon-plus"
            circle
            size="large"
            @click="onAddNewBankCard()"
          />
          {{ t('addBankCard') }}
        </div>
      </div>
    </el-space>
    <el-dialog v-model="addCardDialogVisible" :title="t('addBankCard')" :fullscreen="globalStore.isMobile">
      <el-form label-position="right" label-width="25%" style="width: 100%">
        <el-form-item :label="t('type')">
          <el-select v-model="addCardParams.banktype" size="large" style="width: 100%" @change="resetAddCard()">
            <el-option v-for="(bankType, key) in bankTypeList" :key="key" :label="t(bankType)" :value="bankType" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('channel')">
          <el-select v-model="addCardParams.paymentchannelid" size="large" style="width: 100%">
            <el-option
              v-for="(addCardInfo, key) in addCardInfoList.filter((a) => a.banktype === addCardParams.banktype)"
              :key="key"
              :label="addCardInfo.channelcode"
              :value="addCardInfo.channelid"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="addCardParams.banktype === 'Bank'" :label="t('bankName')">
          <el-input v-model="addCardParams.detail.bankName" size="large" :placeholder="$t('enterBankName')" clearable />
        </el-form-item>
        <el-form-item v-if="addCardParams.banktype === 'Bank'" :label="t('branchName')">
          <el-input
            v-model="addCardParams.detail.bankBranch"
            size="large"
            :placeholder="$t('enterBranchName')"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="addCardParams.banktype === 'Bank'" :label="t('accountName')">
          <el-input v-model="addCardParams.detail.name" size="large" :placeholder="$t('enterAccountName')" clearable />
        </el-form-item>
        <el-form-item v-if="addCardParams.banktype === 'Bank'" :label="t('accountNumber')">
          <el-input
            v-model="addCardParams.detail.bankAccount"
            size="large"
            :placeholder="$t('enterAccountNumber')"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="addCardParams.banktype !== 'Bank'" :label="t('walletAddress')">
          <el-input
            v-model="addCardParams.detail.address"
            size="large"
            :placeholder="$t('enterWalletAddress')"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCardDialogVisible = false"> {{ t('cancel') }}</el-button>
          <el-button type="primary" @click="onSaveCard()">
            {{ t('save') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  addCardInfoApi,
  addCardApi,
  bankInfoApi,
  withdrawalApi,
  deleteCardApi,
  IBankInfoData,
  IAddCardInfoData,
  WithdrawalParams,
  AddCardParams,
  AddCardDetailParams,
  IBankInfoDataDetails,
} from '@/api/bank';

import { useGlobalStore, useUserStore } from '@/store';

import formatNumber from 'format-number';

export default defineComponent({
  name: 'MyComponent',

  setup() {
    const globalStore = useGlobalStore();
    const userStore = useUserStore();

    const { t } = useI18n();

    return {
      t,
      globalStore,
      userStore,
      formatNumber,
    };
  },
  data() {
    return {
      addCardDialogVisible: false,
      addCardParams: reactive(new AddCardParams()),
      bankInfoList: reactive<IBankInfoData[]>([]),
      bankTypeList: reactive<string[]>([]),
      addCardInfoList: reactive<IAddCardInfoData[]>([]),
      minWithdrawal: 0,
      maxWithdrawal: 0,
      selectedbankInfo: reactive<IBankInfoData>({
        banktype: 'Bank',
        id: '',
        paymentchannelid: '',
        detail: reactive<IBankInfoDataDetails>({
          bankAccount: '--',
          bankBranch: '--',
          bankName: '--',
          name: '--',
          address: '--',
        }),
      }),
      withdrawalParams: reactive(new WithdrawalParams()),
    };
  },
  beforeMount() {
    this.getItems();
  },

  async mounted() {
    const response = await addCardInfoApi();
    const result = await response.runAsync();
    this.addCardInfoList = result.data;

    for (var i = 0; i < this.addCardInfoList.length; i++) {
      if (this.bankTypeList.indexOf(this.addCardInfoList[i].banktype) < 0) {
        this.bankTypeList.push(this.addCardInfoList[i].banktype);
      }
    }

    if (this.bankTypeList.length > 0) {
      this.addCardParams.banktype = this.bankTypeList[0];

      this.addCardParams.paymentchannelid = this.addCardInfoList.filter(
        (a) => a.banktype === this.addCardParams.banktype,
      )[0].channelid;
    }
    this.findMinMax();
  },

  methods: {
    async getItems() {
      const response = await bankInfoApi();
      const result = await response.runAsync();
      this.bankInfoList = result.data;
      if (this.bankInfoList.length > 0) {
        this.withdrawalParams.bankinfoid = this.bankInfoList[0].id;
      }
      this.onCardChange();
    },
    findMinMax() {
      let min = 9999;
      let max = 0;
      let isfound = false;
      for (var i = 0; i < this.addCardInfoList.length; i++) {
        if (this.addCardInfoList[i].channelid === this.selectedbankInfo.paymentchannelid) {
          if (this.addCardInfoList[i].transferlimit.from < min) {
            min = this.addCardInfoList[i].transferlimit.from;
          }
          if (this.addCardInfoList[i].transferlimit.to > max) {
            max = this.addCardInfoList[i].transferlimit.to;
          }
          isfound = true;
        }
      }
      if (isfound == false) {
        this.minWithdrawal = 0;
        this.maxWithdrawal = 0;
      } else {
        this.minWithdrawal = min;
        this.maxWithdrawal = max;
      }
    },
    formatLabel(bankInfo: IBankInfoData) {
      if (bankInfo.banktype == 'Bank') {
        return (
          bankInfo.detail.bankName +
          '-' +
          bankInfo.detail.bankBranch +
          ' (' +
          this.t('endingIn') +
          ' ' +
          bankInfo.detail.bankAccount.substring(
            bankInfo.detail.bankAccount.length - 4,
            bankInfo.detail.bankAccount.length,
          ) +
          ')'
        );
      } else {
        return (
          'Ending in ' +
          bankInfo.detail.address.substring(bankInfo.detail.address.length - 4, bankInfo.detail.address.length)
        );
      }
    },
    onAddNewBankCard() {
      this.addCardDialogVisible = true;
    },
    onSearch() {
      this.getItems();
    },
    async onSaveCard() {
      const res = await addCardApi()(this.addCardParams);
      // TODO: add dialog message
      this.getItems();
      this.resetAddCard();
      this.addCardDialogVisible = false;
    },
    async onSubmit() {
      const res = await withdrawalApi()(this.withdrawalParams);
      if (res.err === 0) {
        ElMessageBox.alert(this.$t('withdrawalSuccessMsg'), this.$t('withdrawalSuccessTitle'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('withdrawalSuccessButton'),
          type: 'success',
          center: true,
        })
          .then(() => {
            this.userStore.init();
          })
          .catch(() => {});
      } else {
      }
    },
    async onDeleteCard(bankInfo: IBankInfoData) {
      let ending =
        bankInfo.banktype === 'Bank'
          ? bankInfo.detail.bankAccount.substring(bankInfo.detail.bankAccount.length - 4)
          : bankInfo.detail.address.substring(bankInfo.detail.address.length - 4);
      ElMessageBox.confirm(this.$t('deleteCardMsg', [ending]), this.$t('deleteCardTitle'), {
        customClass: 'delete-dialog',
        confirmButtonText: this.$t('deleteButton'),
        confirmButtonClass: 'confirm-button',
        cancelButtonText: this.$t('cancel'),
      })
        .then(async () => {
          const res = await deleteCardApi()(bankInfo.id);
          await this.getItems();
        })
        .catch(() => {
          return '';
        });
    },

    onCardChange() {
      var bankinfoList = this.bankInfoList.filter((a) => a.id == this.withdrawalParams.bankinfoid);

      if (bankinfoList.length > 0) {
        this.selectedbankInfo = this.bankInfoList.filter((a) => a.id == this.withdrawalParams.bankinfoid)[0];
        this.withdrawalParams.bankinfoid = this.selectedbankInfo.id;
      } else {
        this.selectedbankInfo = {
          banktype: '--',
          id: '',
          paymentchannelid: '',
          detail: reactive<IBankInfoDataDetails>({
            bankAccount: '--',
            bankBranch: '--',
            bankName: '--',
            name: '--',
            address: '--',
          }),
        };
        this.withdrawalParams = new WithdrawalParams();
      }

      this.findMinMax();
    },
    resetAddCard() {
      this.addCardParams.detail = new AddCardDetailParams();
      this.addCardParams.paymentchannelid = this.addCardInfoList.filter(
        (a) => a.banktype === this.addCardParams.banktype,
      )[0].channelid;
    },
  },
});
</script>
<style>
.label-bold > .el-form-item__label {
  font-weight: bold !important;
}
.delete-dialog .confirm-button {
  background-color: #f56c6c;
  border: none;
}
</style>
<style lang="scss" scoped>
.balance {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}
.subtitle {
  font-weight: bold;
  font-size: 20px;
}
.withdraw-amount-item {
  margin-bottom: 0;
}
.withdraw-amount-alert {
  margin-bottom: 18px;
  height: 42px;
}
.bank-details {
  width: 100%;
  min-height: 180px;
  border: solid 2px var(--el-color-primary);
  padding: 10px 0;
  margin-top: 38px;
  .label-bold {
    margin-bottom: 5px;
  }
}
.boxshadow {
  background: rgb(181, 181, 181);
  border: solid 1px transparent;
  background: linear-gradient(146deg, rgba(181, 181, 181, 1) 0%, rgba(255, 255, 255, 1) 65%);

  > .user-balance {
    width: 100%;
    text-align: left;
    padding: 10px 10px 0 10px;
    font-weight: bold;
    font-size: 30px;
    background-image: url('../assets/images/userbalance.jpg');
    background-size: cover;
    height: inherit;
    border-radius: 20px;
    color: #fff;
    > .balance-label {
      font-weight: normal;
    }
  }
}
.bank-card-container {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
  justify-content: left;
}
.bank-card.addnew {
  border: dashed 1px var(--el-color-primary);
}
.bank-card {
  width: 250px;
  height: 130px;
  padding: 10px;
  box-shadow: 3px 3px #c9c9c9;

  border-radius: 10px;

  .bank-card-header {
    font-weight: bold;
    padding: 5px 0px 10px;
    .delete-btn {
      float: right;
    }
  }
  .bank-card-body {
    .text.item {
      margin-bottom: 5px;
    }
  }
  .add {
    display: grid;
    justify-items: center;
    align-items: center;
    height: 100%;
    padding: 10px 0;
    .add-btn {
      width: 50px;
      height: 50px;
      font-size: 30px;
      font-weight: bold;
    }
  }
}
</style>
