<template>
  <div class="total-panel">
    <el-row :gutter="30" style="justify-content: space-between">
      <el-col v-for="(item, index) in list" :key="index" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <div class="card" @click="navigateTo(item.path, item.params, item.newTab)">
          <div class="card-icon">
            <Icons :item="item.title" :size="50" class="specialTreatedIcon" />
          </div>
          <div>
            {{ t(item.title).toUpperCase() }}
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { useLocalesI18n } from '@/locales/i18n';
import { router } from '@/router';
import { useGlobalStore, useUserStore } from '@/store';

var name = useUserStore().user.realname || useUserStore().user.username;
var email = useUserStore().user.email;
var language = useGlobalStore().i18n.locale.value;

var supporturl = useGlobalStore()
  .liveChat.setting.url.replace('{name}', name)
  .replace('{email}', email)
  .replace('{lang}', language);

let { t } = useLocalesI18n({}, [(locale) => import(`../lang/${locale}.json`), 'dashboard']);

function navigateTo(path: string, params: any = {}, newTab = false) {
  if (newTab) {
    window.open(path, '_blank', 'width=800,height=600');
  } else {
    router.push({ path: path, query: { ...params } });
  }
}

const list = reactive([
  {
    title: 'addagent',
    icon: 'mel-icon-platform',
    path: '/team/agent',
    params: {
      perform: 'add',
    },
  },
  {
    title: 'addplayer',
    icon: 'mel-icon-user-filled',
    path: '/team/player',
    params: {
      perform: 'add',
    },
  },
  {
    title: 'dashboard',
    icon: 'mel-icon-user-filled',
    path: '/dashboard',
  },
  {
    title: 'changepassword',
    icon: 'mel-icon-user-filled',
    path: '/account/index',
    params: {
      perform: 'changePass',
    },
  },
  {
    title: 'wallet',
    icon: 'mel-icon-user-filled',
    path: '/wallet/withdraw',
  },
  {
    title: 'referrallink',
    icon: 'mel-icon-user-filled',
    path: '/dashboard',
  },
  {
    title: 'winlossreport',
    icon: 'mel-icon-user-filled',
    path: '/report/winloss',
  },
  {
    title: 'helpcenter',
    icon: 'mel-icon-user-filled',
    path: supporturl,
    newTab: true,
  },
]);
</script>
<style lang="scss" scoped>
.card {
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 9px 18px rgba(0, 0, 0, 0.1), 0 15px 12px rgba(0, 0, 0, 0.02);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease-in-out;

  // &:hover {
  //   background-color: #07b5bc;
  //   color: #fff;

  //   &:hover {
  //     > .card-icon img {
  //       //convert to white
  //       filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
  //     }
  //   }
  // }

  &:hover {
    background-color: var(--el-color-primary);
    div {
      color: var(--el-color-white);
    }

    .card-icon div {
      background: var(--el-color-white);
    }

    //

    //make content filter in white
  }
}

.card-icon {
  height: 100px;
  width: 100px;
  pointer-events: none;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
