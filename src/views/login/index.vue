<template>
  <div class="login">
    <login-header class="header"></login-header>
    <div id="wrapper">
      <div class="title">Agent Admin 2.0</div>
      <div class="form" @keyup.enter.exact="login">
        <el-form ref="formRef" :model="loginParams" class="EPForm">
          <el-form-item prop="username">
            <el-input v-model="loginParams.username" class="textInput" autofocus :placeholder="t('username')" clearable
              size="large" />
          </el-form-item>
          <el-form-item prop="password" class="textInput">
            <el-input v-model="loginParams.password" class="textInput" type="password" :placeholder="t('password')"
              clearable show-password size="large" />
          </el-form-item>

          <el-button class="submit" type="primary" size="large" @click="login">{{ t('login') }}</el-button>
        </el-form>
      </div>

      <div class="btm-container">
        <!-- <el-button text @click="dialogVisible = true" class="button-forgot">
          {{ $t('iForgotMyPassword') }}
        </el-button> -->

        <me-locale-select v-if="localeConfig.localeList.length > 1" class="item"></me-locale-select>
      </div>

      <el-dialog v-model="dialogVisible" width="40%" :title="$t('iForgotMyPassword')">
        <div>
          <el-form ref="formRef" :model="loginParams" label-width="200px">
            <el-form-item :label="t('email')" props="email" required>
              <el-input v-model="forgotPassword.email" class="textInput" autofocus :placeholder="t('email')" clearable>
              </el-input>
            </el-form-item>

            <el-form-item :label="t('verificationCode')" required>
              <el-input v-model="resetPassword.validatecode" class="textInput" :placeholder="t('verificationCode')"
                :maxlength="6" autofocus clearable>
                <template #append>
                  <div v-if="forgotPassword.timer === 60">
                    <el-button type="primary" class="btn-custom" :disabled="forgotPassword.email === ''"
                      @click="performRequestCode">
                      {{ t('requestCode') }}
                    </el-button>
                  </div>
                  <div v-else>
                    <el-button>
                      {{ t('resend') }}
                      {{ forgotPassword.timer > 0 ? '(' + forgotPassword.timer + ')' : '' }}
                    </el-button>
                  </div>
                </template></el-input>
            </el-form-item>
            <el-form-item :label="t('newPassword')" required>
              <el-input v-model="resetPassword.newpwd" class="textInput" type="password" :placeholder="t('newPassword')"
                clearable show-password />
            </el-form-item>

            <el-form-item :label="t('confirmPassword')" required>
              <el-input v-model="forgotPassword.confirmpass" class="textInput" type="password"
                :placeholder="t('reEnterPassword')" clearable show-password />
            </el-form-item>
          </el-form>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <div>
              <el-button type="primary" @click="performResetPassword"> {{ t('resetPassword') }} </el-button>
            </div>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts" name="Login">
import LoginHeader from './components/header.vue';
import { LoginParams } from '@/api/user';
import { requestVerificationCode, performChangePassword } from '@/api/agent';
import { useLocalesI18n } from '@/locales/i18n';
import type { FormInstance, FormRules } from 'element-plus';
import { useUserStore } from '@/store';
import { localeConfig } from '@/config';

const userStore = useUserStore();
const formRef = ref<FormInstance>();
const route = useRoute();
const router = useRouter();
let loginParams = reactive(new LoginParams());
let { t } = useLocalesI18n();

let forgotPassword = reactive<RuleForm>({
  phone: '',
  email: '',
  confirmpass: '',
  timer: 60,

  scene: 1,
});

let resetPassword = reactive<RuleForm>({
  newpwd: '',
  securitykey: '',
  validatecode: '',
});

const dialogVisible = ref(false);

const startTimer = () => {
  const timer = setInterval(() => {
    if (forgotPassword.timer === 0) {
      clearInterval(timer);
      forgotPassword.timer = 60;
    } else {
      forgotPassword.timer--;
    }
  }, 1000);
};

const performRequestCode = async () => {
  if (forgotPassword.email) {
    const res = await requestVerificationCode()({
      email: forgotPassword.email,
    });
    if (res) {
      resetPassword.securitykey = res.data;
      startTimer();
    }
  }
};

const performResetPassword = async () => {
  if (forgotPassword.confirmpass !== resetPassword.newpwd) {
    ElMessage.error(t('passwordNotSame'));
    return;
  } else {
    const res = await performChangePassword()(resetPassword);
    if (res) {
      dialogVisible.value = false;
    }
  }
};

const login = async () => {
  if (loginParams.username === '' && loginParams.password === '') {
    ElMessage.error(t('usernameOrPasswordEmpty'));
    return;
  }
  if (loginParams.username === '') {
    ElMessage.error(t('usernameCannotEmpty'));
    return;
  }
  if (loginParams.password === '') {
    ElMessage.error(t('passwordCannotEmpty'));
    return;
  }
  formRef.value?.validate(async (valid, fields) => {
    if (valid) {
      await userStore.login(loginParams);
      await router.replace((route.query.redirect as string) || '/');
    }
  });
};
</script>
<style lang="scss" scoped>
.login {
  background-color: var(--el-bg-color-page);
  width: 100%;
  height: 100%;
  position: relative;

  .bg {
    position: absolute;
    left: 50%;
    top: 40%;
    max-width: 500px;
    max-height: 500px;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);

    @media only screen and (max-width: 500px) {
      background-size: contain;
    }
  }

  .header {
    width: 100%;
  }

  .EPForm {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: center;
    width: 100%;
  }

  #wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    min-height: 80%;
  }

  .title {
    text-align: center;
    width: 100%;
    font-weight: bold;
    color: #07b5bc;
    font-size: 25px;
  }

  .form {
    z-index: 1;
    width: 100%;

    max-width: 500px;
    padding: 30px 50px;
    background-color: var(--el-mask-color);
    border-radius: 12px;
    box-shadow: 0 9px 28px rgba(0, 0, 0, 0.1), 0 15px 12px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    :deep(.el-input) {
      .captcha {
        margin: 0 -19px;
        height: calc(var(--el-component-size) - 2px);
      }
    }

    :deep(.el-input--large) {
      .captcha {
        height: calc(var(--el-component-size-large) - 2px);
      }
    }

    :deep(.el-input--small) {
      .captcha {
        height: calc(var(--el-component-size-small) - 2px);
      }
    }

    .el-form-item {
      width: 100%;
    }

    .submit {
      width: fit-content;
      padding: 10px 20px;
      display: block;
    }
  }

  .btm-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .button-forgot {
      margin-bottom: 20px;
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
}
</style>
