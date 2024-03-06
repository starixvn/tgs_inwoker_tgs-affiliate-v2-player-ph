import { Composer } from 'vue-i18n';
import { event, mitter } from '@/event';
import { Ref } from 'vue';
import { LoadingOptions } from 'element-plus';
import { forOwn } from 'lodash-es';
import { getLocalization, getFeatures, getLiveChat } from '@/api/misc';

const WIDTH = 992; // refer to Bootstrap's responsive design
const isMobile = ref(window.document.body.offsetWidth < WIDTH);
mitter.on(event.RESIZE, () => {
  isMobile.value = window.document.body.offsetWidth < WIDTH;
});

interface Localization {
  [key: string]: string;
}
interface Features {
  [key: string]: string;
}
interface GlobalState {
  i18n: Ref<Composer<unknown, unknown, unknown>>;
  isMobile: Ref<boolean>;
  layoutLoaded: boolean;
  localization: Localization;
  features: Features;
  liveChat: any;
}

export default defineStore({
  id: 'global',
  state: (): GlobalState => {
    let _i18n: Composer<unknown, unknown, unknown>;
    return {
      i18n: customRef((track, trigger) => {
        return {
          get() {
            track(); // track 方法放在 get 中，用于提示这个数据是需要追踪变化的
            return _i18n;
          },
          set(i18n: Composer<unknown, unknown, unknown>) {
            if (!_i18n) {
              // 只初始化一次值
              _i18n = i18n;
              trigger(); // 记得触发事件 trigger,告诉vue触发页面更新
            }
          },
        };
      }),
      isMobile,
      layoutLoaded: false,
      localization: {} as Localization,
      features: {},
      liveChat: {},
    };
  },
  actions: {
    init: async function (tokenValue?: string) {},
    // 登录
    getFeature: async function () {
      const res = await getFeatures()();
      this.features = res;
    },
    // 退出
    getLocalization: async function () {
      const res = await getLocalization()();
      this.localization = res.data;
    },
    //store data into localization
    setLocalization: function (localization: any) {
      this.localization = localization;
    },
    setFeatures: function (features: any) {
      this.features = features;
    },
    getLiveChat: async function () {
      const res = await getLiveChat()();
      this.liveChat = res.data;
    },
  },
});
