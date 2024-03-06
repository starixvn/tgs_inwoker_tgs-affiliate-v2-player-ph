<template>
  <div class="right">
    <!-- <me-locale-select v-if="localeConfig.localeList.length > 1" class="item"></me-locale-select> -->
    <!-- <me-size-select v-if="themeConfig.showSize" class="item"></me-size-select> -->
    <user class="item"></user>
  </div>
</template>
<script setup lang="ts" name="Right">
import { localeConfig } from '@/config';
import { useSettingStore } from '@/store';
import User from './components/user.vue';
const { themeConfig } = useSettingStore();
</script>
<style lang="scss" scoped>
.right {
  font-size: 14px;
  height: 100%;
  display: flex;

  .item {
    height: 100%;
  }

  .no-hover:hover {
    background-color: unset;
  }

  &:deep(.el-space__item) {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
