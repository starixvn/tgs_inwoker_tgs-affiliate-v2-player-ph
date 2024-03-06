<template>
  <div class="right-container">
    <div class="time-container" trigger="click">
      <div>{{ currentTime }} (GMT+7)</div>
    </div>

    <div>
      <div class="flex-center pointer" v-bind="$attrs">
        <me-locale-select v-if="config.localeList.length > 1" class="item"></me-locale-select>
      </div>
    </div>
    <el-dropdown class="me-size-select" trigger="click" max-height="500px">
      <div class="flex-center pointer" v-bind="$attrs">
        <span v-if="!globalStore.isMobile" class="ellipsis-2">{{ userStore.user.username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item divided @click="userStore.logOut()">
            {{ $t('logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="User">
import { useGlobalStore, useUserStore } from '@/store';
import { localeConfig as config } from '@/config';
import moment from 'moment';
import { ref, onMounted } from 'vue';

const userStore = useUserStore();
const globalStore = useGlobalStore();

const currentTime = ref(moment().utcOffset(420).format('YYYY/MM/DD hh:mm A'));

onMounted(() => {
  setInterval(() => {
    currentTime.value = moment().utcOffset(420).format('YYYY/MM/DD hh:mm A');
  }, 1000);
});
</script>

<style lang="scss" scoped>
.time-container {
  padding: 0 10px;
  font-size: 12px;
}

.right-container {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.flex-center {
  max-width: 120px;
  padding: 0 10px;
  line-height: 120%;

  .avatar {
    margin-right: 5px;
    flex-shrink: 0;
  }
}
</style>
