<template>
  <div class="big-container">
    <div class="big-title">{{ $t('myaccount').toUpperCase() }}</div>
    <div class="content-wrapper">
      <div class="contents">
        <div class="another-big-title">{{ $t('myprofile') }}</div>
        <div class="content-inside-content">
          <div>
            <div v-for="item in profileInfo.list" :key="item.name">
              <div class="profile-info">
                <div class="title">{{ $t(item.name) }}:</div>

                <div class="data">
                  {{ item.translate ? t(item.value) : item.value }}
                  <el-popover
                    trigger="click"
                    placement="right"
                    :width="400"
                    v-if="item.editable"
                    @before-enter="resetUpdateEmail"
                    @after-leave="resetUpdateEmail"
                  >
                    <template #reference>
                      <el-button size="small" type="primary" :icon="Edit"> </el-button>
                    </template>
                    <div>
                      <el-row style="margin-bottom: 0px">
                        <el-col :span="24" style="margin-bottom: 10px">
                          <div class="popover-title">{{ t('updateEmail') }}</div>
                        </el-col>
                        <el-col :span="24" style="margin-bottom: 10px">
                          <div class="input-row-no-label">
                            <el-input
                              v-model="state.email"
                              class="textInput"
                              :disabled="state.sceneEmail === 1 && state.isemptyEmail === false"
                              :placeholder="t('email')"
                              clearable
                            />
                          </div>
                          <div class="input-row-no-label">
                            <el-input
                              v-model="updateEmail.validatecode"
                              class="textInput"
                              :placeholder="t('verificationCode')"
                              clearable
                            >
                              <template #append>
                                <div v-if="state.timer === 60">
                                  <el-button
                                    type="primary"
                                    class="btn-custom"
                                    :disabled="state.email === null || state.email === ''"
                                    @click="getVerificationCodeForEmail"
                                  >
                                    {{ t('requestCode') }}
                                  </el-button>
                                </div>
                                <div v-else>
                                  <el-button class="btn-custom">
                                    {{ t('resend') }}
                                    {{ state.timer > 0 ? '(' + state.timer + ')' : '' }}
                                  </el-button>
                                </div>
                              </template></el-input
                            >
                          </div>
                        </el-col>

                        <el-col :span="24" v-if="state.sceneEmail === 2">
                          <el-row justify="end"
                            ><el-button @click="onBackClick">
                              {{ t('back') }}
                            </el-button>
                            <el-button
                              type="primary"
                              @click="onUpdateEmail"
                              :disabled="updateEmail.validatecode === '' || state.email === '' || state.email === null"
                            >
                              {{ t('submit') }}
                            </el-button></el-row
                          >
                        </el-col>

                        <el-col :span="24" v-if="state.sceneEmail === 1">
                          <el-row justify="end"
                            ><el-button
                              type="primary"
                              :disabled="updateEmail.validatecode === ''"
                              @click="onVerfiyEmailCode"
                            >
                              {{ t('nextStep') }}
                            </el-button>
                          </el-row>
                        </el-col>
                      </el-row>
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
            <div class="profile-info">
              <div class="title">{{ $t('loginpassword') }}:</div>

              <div class="data">
                <el-popover trigger="click" placement="right" :width="500" @before-enter="onEnterResetPass">
                  <template #reference>
                    <el-button ref="buttonRef" style="width: 170px" type="primary">{{ t('resetPassword') }}</el-button>
                  </template>
                  <div>
                    <el-row style="margin-bottom: 10px">
                      <el-col :span="24" style="margin-bottom: 10px">
                        <div class="popover-title">{{ t('loginpassword') }}</div>
                      </el-col>
                      <el-col :span="24">
                        <div class="input-row">
                          <div class="label"><span />{{ t('currentPassword') }}</div>
                          <el-input
                            v-model="updatePassword.oldpwd"
                            class="textInput"
                            type="password"
                            :placeholder="t('currentPassword')"
                            clearable
                            show-password
                          />
                        </div>

                        <div class="input-row">
                          <div class="label"><span />{{ t('newPassword') }}</div>
                          <el-input
                            v-model="updatePassword.newpwd"
                            class="textInput"
                            type="password"
                            :placeholder="t('newPassword')"
                            clearable
                            show-password
                          />
                        </div>

                        <div class="input-row">
                          <div class="label"><span />{{ t('confirmPassword') }}</div>
                          <el-input
                            v-model="state.confirmpassword"
                            class="textInput"
                            type="password"
                            :placeholder="t('reEnterPassword')"
                            clearable
                            show-password
                          />
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom: 0px">
                      <el-col :span="24">
                        <el-form :label-width="80" label-position="left"> </el-form>
                      </el-col>
                      <el-col :span="24">
                        <el-row justify="end"
                          ><el-button
                            type="primary"
                            :disabled="
                              updatePassword.oldpwd === '' ||
                              updatePassword.newpwd === '' ||
                              updatePassword.newpwd !== state.confirmpassword
                            "
                            @click="updateNewPassword"
                          >
                            {{ t('submit') }}
                          </el-button></el-row
                        >
                      </el-col>
                    </el-row>
                  </div>
                </el-popover>
              </div>
            </div>

            <div class="profile-info">
              <div class="title">{{ $t('withdrawpassword') }}:</div>

              <div class="data">
                <div v-if="!useUserStore().user.issetpaypassword">
                  <el-popover
                    trigger="click"
                    placement="right"
                    :width="460"
                    @before-enter="onEnterChangeWithdrawalPass"
                  >
                    <template #reference>
                      <el-button style="width: 170px">{{ t('withdrawpassword') }}</el-button>
                    </template>
                    <div v-if="state.scene === 1">
                      <el-row>
                        <el-col :span="24" style="margin-bottom: 10px">
                          <div class="popover-title">{{ t('withdrawpassword') }}</div>
                        </el-col>
                        <el-col :span="24" style="margin-bottom: 10px">
                          <div class="input-row-no-label">
                            <el-input
                              v-model="state.email"
                              class="textInput"
                              disabled
                              :placeholder="t('email')"
                              clearable
                            />
                          </div>
                          <div class="input-row-no-label">
                            <el-input
                              v-model="updateWithdrawalPassword.validatecode"
                              class="textInput"
                              :placeholder="t('verificationCode')"
                              clearable
                            >
                              <template #append>
                                <div v-if="state.timer === 60">
                                  <el-button
                                    class="btn-custom"
                                    type="primary"
                                    :disabled="state.isemptyEmail === true"
                                    @click="getVerificationCodeForWithdrawalPassword"
                                  >
                                    {{ t('requestCode') }}
                                  </el-button>
                                </div>
                                <div v-else>
                                  <el-button class="btn-custom">
                                    {{ t('resend') }}
                                    {{ state.timer > 0 ? '(' + state.timer + ')' : '' }}
                                  </el-button>
                                </div>
                              </template></el-input
                            >
                          </div>
                        </el-col>
                        <el-col :span="24">
                          <el-row justify="end"
                            ><el-button
                              type="primary"
                              :disabled="
                                updateWithdrawalPassword.validatecode === '' ||
                                state.email === '' ||
                                state.email === null
                              "
                              @click="state.scene = 2"
                            >
                              {{ t('nextStep') }}
                            </el-button></el-row
                          >
                        </el-col>
                      </el-row>
                    </div>
                    <div v-else>
                      <el-row style="margin-bottom: 0px">
                        <el-col :span="24">
                          <div class="popover-title">{{ t('withdrawpassword') }}</div>
                        </el-col>
                        <el-col :span="24">
                          <div class="input-row">
                            <div class="label">{{ t('newPassword') }}</div>
                            <el-input
                              v-model="updateWithdrawalPassword.newpwd"
                              class="textInput"
                              type="password"
                              :placeholder="t('newPassword')"
                              clearable
                              show-password
                            />
                          </div>

                          <div class="input-row">
                            <div class="label">{{ t('confirmPassword') }}</div>
                            <el-input
                              v-model="state.confirmwithdrawpassword"
                              class="textInput"
                              type="password"
                              :placeholder="t('confirmPassword')"
                              clearable
                              show-password
                            />
                          </div>
                        </el-col>
                      </el-row>
                      <el-row style="margin-bottom: 0px">
                        <el-col :span="24">
                          <el-row justify="end"
                            ><el-button @click="state.scene = 1">
                              {{ t('back') }}
                            </el-button>
                            <el-button type="primary" @click="updateTheWithdrawalPassword">
                              {{ t('submit') }}
                            </el-button></el-row
                          >
                        </el-col>
                      </el-row>
                    </div>
                  </el-popover>
                </div>
                <div v-else>
                  <el-button style="width: 170px" @click="askUserContactSupport">{{ t('withdrawpassword') }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-content">
        <div>
          <div class="contents">
            <div class="another-big-title">{{ $t('mydomain') }}</div>
            <div class="content-inside-content">
              <div v-for="item in $state.user.agentdomains" :key="item">
                <div class="links">
                  <div>{{ item }}</div>
                  <div>
                    <el-button @click="performCopyText(item)">
                      <el-icon><Link /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="contents">
          <div class="another-big-title">{{ $t('profitshare') }}</div>
          <el-table
            v-if="$state.user.agentdividendtype === 'MultipleLayer'"
            :data="$state.user.dividendconditions"
            class="table-border"
          >
            <el-table-column :label="t('netprofit')" prop="netprofit" align="center" />
            <el-table-column :label="t('activenumber')" prop="activenumber" align="center" />
            <el-table-column :label="t('configdividendpercentage')" prop="dividendpercentage" align="center"
          /></el-table>
          <div class="content-inside-content">
            <div class="table-background">
              <div v-for="item in profitShare" :key="item.name">
                <div class="profit-share-item">
                  <div class="table-content">{{ $t(item.name) }}</div>
                  <div class="table-content">{{ item.value }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="profile">
import {
  performUpdatePassword,
  performGetChangeWithdrawalPasswordVerificationCode,
  performGetChangeEmailVerificationCode,
  performUpdateWithdrawalPassword,
  GetEmailVerificationCodeParams,
  verifyEmailCode,
  VerifyEmailCodeParams,
} from '@/api/agent';
import { useLocalesI18n } from '@/locales/hooks';
import { useUserStore } from '@/store';
import { Link } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Edit } from '@element-plus/icons-vue';
import moment from 'moment';

// Props
const props = defineProps({
  perform: String,
});
const buttonRef = ref(null);
onMounted(() => {
  if (props.perform === 'changePass') {
    buttonRef.value?.$el?.click();
  }
});

const { $state } = useUserStore();
//from $state get the data

let { t } = useLocalesI18n();

function performCopyText(text: string) {
  const input = document.createElement('input');
  input.setAttribute('readonly', 'readonly');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, 9999);
  document.execCommand('copy');
  document.body.removeChild(input);

  ElMessage.success(t('copied'));
}

const state = reactive({
  confirmpassword: '',
  confirmwithdrawpassword: '',
  timer: 60,
  scene: 1,
  sceneEmail: 1,
  email: $state.user?.email,
  isemptyEmail: $state.user?.email === null,
});

const updatePassword = reactive({
  oldpwd: '',
  newpwd: '',
});

const updateWithdrawalPassword = reactive({
  newpwd: '',
  securitykey: '',
  validatecode: '',
});
const updateEmail = reactive({
  email: '',
  securitykey: '',
  validatecode: '',
});
const profitShare = reactive([
  { name: 'live', value: $state.user?.dividendpercentage },
  { name: 'sportsbook', value: $state.user?.dividendpercentage },
  { name: 'egame', value: $state.user?.dividendpercentage },
  { name: 'lottery', value: $state.user?.dividendpercentage },
  { name: 'esports', value: $state.user?.dividendpercentage },
  { name: 'qipai', value: $state.user?.dividendpercentage },
  { name: 'visualsports', value: $state.user?.dividendpercentage },
  { name: 'cockfight', value: $state.user?.dividendpercentage },
  { name: 'horserace', value: $state.user?.dividendpercentage },
]);

//convert datetime into readable format with date and time
const convertDate = (date: string) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

const askUserContactSupport = () => {
  ElMessage.error(t('youveSetWithdrawalPassword'));
};

const translate = (value: any) => {
  var altered = value.toString().replace(/,/g, '');
  return t(altered);
};
let autoSaveInterval: any = null;
const startTimer = () => {
  autoSaveInterval = setInterval(() => {
    if (state.timer === 0) {
      clearInterval(autoSaveInterval);
      state.timer = 60;
    } else {
      state.timer--;
    }
  }, 1000);
};

const getVerificationCodeForWithdrawalPassword = async () => {
  const res = await performGetChangeWithdrawalPasswordVerificationCode()();
  if (res) {
    updateWithdrawalPassword.securitykey = res.data;
    startTimer();
  }
};
const getVerificationCodeForEmail = async () => {
  const getEmailVerificationCodeParams = new GetEmailVerificationCodeParams();
  getEmailVerificationCodeParams.email = state.email;

  const res = await performGetChangeEmailVerificationCode()(getEmailVerificationCodeParams);

  if (res) {
    updateEmail.securitykey = res.data;
    startTimer();
  }
};
const onEnterResetPass = () => {
  state.email = $state.user?.email;
  updatePassword.newpwd = '';
  updatePassword.oldpwd = '';
  state.confirmpassword = '';
};
const onEnterChangeWithdrawalPass = () => {
  state.email = $state.user?.email;
  updateWithdrawalPassword.newpwd = '';
  updateWithdrawalPassword.securitykey = '';
  updateWithdrawalPassword.validatecode = '';
  state.confirmwithdrawpassword = '';
};
const updateTheWithdrawalPassword = async () => {
  if (updateWithdrawalPassword.newpwd !== state.confirmwithdrawpassword) {
    ElMessage.error(t('passwordNotSame'));
    return;
  }
  const res = await performUpdateWithdrawalPassword()(updateWithdrawalPassword);
  if (res.err === 0) {
    ElMessage.success(t('withdrawalPasswordResetSuccess'));
    updateWithdrawalPassword.newpwd = '';
    updateWithdrawalPassword.securitykey = '';
    updateWithdrawalPassword.validatecode = '';
    document.getElementsByTagName('body')[0].click();
  }
};

interface ListItem {
  name: string;
  value: string;
  editable: boolean;
  translate: boolean;
}

const profileInfo = reactive({
  list: [] as ListItem[],
});

profileInfo.list.push({ name: 'agentusername', value: $state.user?.username, editable: false, translate: false });
profileInfo.list.push({ name: 'realname', value: $state.user?.realname, editable: false, translate: false });
profileInfo.list.push({
  name: 'registeron',
  value: convertDate($state.user?.registeredon),
  editable: false,
  translate: false,
});
profileInfo.list.push({ name: 'balance', value: $state.user?.balance.toString(), editable: false, translate: false });
profileInfo.list.push({ name: 'status', value: $state.user?.status, editable: false, translate: true });
profileInfo.list.push({ name: 'type', value: $state.user?.type, editable: false, translate: true });
profileInfo.list.push({
  name: 'accumulatedProfitShare',
  value: $state.user?.accumulatedprofitsharing.toString(),
  editable: false,
  translate: false,
});
profileInfo.list.push({
  name: 'profitSharePT',
  value: $state.user?.dividendpercentage + '%',
  editable: false,
  translate: false,
});
profileInfo.list.push({ name: 'email', value: $state.user?.email, editable: true, translate: false });
profileInfo.list.push({ name: 'phone', value: $state.user?.phone, editable: false, translate: false });

const updateNewPassword = async () => {
  if (updatePassword.newpwd !== state.confirmpassword) {
    ElMessage.error(t('passwordNotSame'));
    return;
  }
  const res = await performUpdatePassword()(updatePassword);
  if (res.err === 0) {
    ElMessage.success(t('passwordResetSuccess'));
    updatePassword.newpwd = '';
    updatePassword.oldpwd = '';
    document.getElementsByTagName('body')[0].click();
  }
};
const resetUpdateEmail = () => {
  updateEmail.validatecode = '';
  state.sceneEmail = 1;
  state.timer = 60;

  clearInterval(autoSaveInterval);
};
const onBackClick = () => {
  document.getElementsByTagName('body')[0].click();
};
const onUpdateEmail = async () => {
  const res = await onVerfiyEmailCode();
};

const onVerfiyEmailCode = async () => {
  const verifyEmailCodeParams = new VerifyEmailCodeParams();
  verifyEmailCodeParams.securitykey = updateEmail.securitykey;
  verifyEmailCodeParams.validatecode = updateEmail.validatecode;

  const res = await verifyEmailCode()(verifyEmailCodeParams);
  if (res.err === 0) {
    if (state.sceneEmail === 1) {
      state.sceneEmail = 2;
      state.email = '';
      state.timer = 60;
      clearInterval(autoSaveInterval);
      updateEmail.validatecode = '';
    } else {
      await useUserStore().init();

      const itemIndex = profileInfo.list.findIndex((item) => item.name === 'email');
      if (itemIndex !== -1) {
        profileInfo.list[itemIndex].value = state.email;
      }

      ElMessage.success(t('emailUpdateSuccess'));
      document.getElementsByTagName('body')[0].click();
    }
  } else {
    ElMessage.error(t('invalidCode'));
  }
};
</script>

<style lang="scss" scoped>
.profit-share-item {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1px;
}

.popover-title {
  font-weight: bold;
  padding-bottom: 10px;
}

.big-title {
  font-size: 40px;
  font-weight: bold;
  padding: 20px 30px;
}

.content-wrapper {
  display: grid;
  width: 100%;
  gap: 20px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.another-big-title {
  font-size: 35px;
  font-weight: bold;
  padding: 10px 20px;
}

.contents {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 20px 20px;
}

.right-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-inside-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 50px;
}

.links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;

  //on mobile
  @media (max-width: 768px) {
    > :first-child {
      //elipsis
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
    }
  }
}

.input-row {
  display: grid;
  grid-template-columns: 30% auto;
  gap: 10px;
  padding-bottom: 10px;
  align-items: center;

  .label {
    text-align: right;

    span::before {
      content: '*';
      color: var(--el-color-danger);
      margin-right: 4px;
    }
  }
}

.input-row-no-label {
  padding-bottom: 10px;
}

.table-border {
  border: solid 1px;
  border-color: #efefef;
}

.table-background {
  background: #efefef;
  padding: 1px;
  display: grid;
  gap: 1px;
  grid-template-columns: 1fr 1fr;
}

.table-content {
  background: #fff;
  padding: 10px 20px;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.profile-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  max-height: 30px;

  .title {
    text-align: right;
  }

  .data {
    text-align: left;
  }
}
.btn-custom {
  background-color: var(--el-color-primary) !important;
  color: #fff !important;
  border-radius: 0px;
  &.is-disabled {
    background-color: var(--el-button-disabled-bg-color) !important;
    color: #fff !important;
  }
}
</style>
