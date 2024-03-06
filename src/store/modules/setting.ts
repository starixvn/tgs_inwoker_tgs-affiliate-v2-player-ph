import { Language } from 'element-plus/es/locale';
import { themeConfig, settingKey, localeConfig } from '@/config';
import { event, mitter } from '@/event';
import { mixColor } from '@/utils/helper';
const { css } = useStyleTag('');

const primarycolor = '#07b5bc';
const warningColor = '#fbc02d';
const warningAlertBg = '#fffbe7';

const useSettingStore = defineStore('setting', {
  state: () => ({
    themeConfig: useStorage(`${settingKey}-theme`, themeConfig, localStorage, { mergeDefaults: true }),
    locale: useStorage(`${settingKey}-locale`, localeConfig.localeSetting.locale ?? 'tgl-ph'),
    elLocale: undefined as Language | undefined,
    isDark: false,
    showSettingMenu: false,
  }),
  actions: {
    setPrimaryStyle() {
      const style = [];
      const darkStyle = [];
      style.push(`--el-color-primary: ${primarycolor}  !important`);
      style.push(`--el-color-warning: ${warningColor}  !important`);
      style.push(`--el-color-warning-light-9:${warningAlertBg}   !important`);
      darkStyle.push(`--el-color-primary: ${primarycolor} !important`);
      style.push('--el-color-primary-rgb:' + mixColor(primarycolor, '#000000', 0) + ' !important');
      darkStyle.push('--el-color-primary-rgb:' + mixColor(primarycolor, '#000000', 0) + ' !important');
      style.push('--el-color-primary-dark-2:' + mixColor(primarycolor, '#000000', 0.2) + ' !important');
      darkStyle.push('--el-color-primary-dark-2:' + mixColor(primarycolor, '#ffffff', 0.2) + ' !important');
      [3, 5, 7, 8, 9].forEach((number) => {
        style.push(
          `--el-color-primary-light-${number}:` + mixColor(primarycolor, '#ffffff', number / 10) + ' !important',
        );
        darkStyle.push(
          `--el-color-primary-light-${number}:` + mixColor(primarycolor, '#141414', number / 10) + ' !important',
        );
      });
      css.value = ':root{' + style.join(';') + '}' + '.dark{' + darkStyle.join(';') + '}';
    },
    clearCache() {
      localStorage.clear();
    },
  },
});
mitter.once(event.READY, () => {
  const settingStore = useSettingStore();
  watch(() => settingStore.themeConfig.primaryColor, settingStore.setPrimaryStyle, { immediate: true });
});
export default useSettingStore;
