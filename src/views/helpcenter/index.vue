<template>
  <div>
    {{ t('ifFailPressRefresh') }}
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore, useUserStore } from '@/store';

import { useLocalesI18n } from '@/locales/hooks';

let { t } = useLocalesI18n();

var name = useUserStore().user.realname || useUserStore().user.username;
var email = useUserStore().user.email;
var language = useGlobalStore().i18n.locale.value;

var supporturl = useGlobalStore()
  .liveChat.setting.url.replace('{name}', name)
  .replace('{email}', email)
  .replace('{lang}', language);

window.open(supporturl, '_blank', 'width=800,height=600');
close('helpcenter', 'helpcenter');
</script>
