<template>
  <el-dropdown trigger="click" class="dropdown">
    <span class="dropdown-menu">
      {{ localeConfig.localeList.filter((a) => a.locale === $i18n.locale)[0].text }}
      <el-icon>
        <mel-icon-arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) in localeConfig.localeList"
          :key="index"
          :disabled="$i18n.locale === item.locale"
          @click="setLanguage(item.locale)"
          >{{ $t(item.text) }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts" name="MeTranslation">
import { localeConfig } from '@/config';
import { setI18nLanguage } from '@/locales/i18n';
const setLanguage = (locale: string) => {
  setI18nLanguage(locale, false);
};
</script>
<style lang="scss" scoped>
.me-locale-select {
  line-height: 100%;

  .flex-center {
    padding: 0 10px;

    .icon {
      font-size: 1.3em;
    }
  }
}

.dropdown {
  :hover {
    cursor: pointer;
  }
}

.dropdown-menu {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
