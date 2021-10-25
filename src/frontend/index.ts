import Vue from "vue";
import {
  MdApp,
  MdButton,
  MdCheckbox,
  MdContent,
  MdDialogAlert,
  MdDialogConfirm,
  MdDialog,
  MdIcon,
  MdList,
  MdProgress,
  MdSteppers,
  MdSubheader,
  MdTable,
  MdToolbar,
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.css";
import "vue-material/dist/theme/default.css";

import App from "./App.vue";
import I18n from "./I18n";

Vue.use(MdApp as Vue.PluginObject<unknown>);
Vue.use(MdButton as Vue.PluginObject<unknown>);
Vue.use(MdCheckbox as Vue.PluginObject<unknown>);
Vue.use(MdContent as Vue.PluginObject<unknown>);
Vue.use(MdDialogAlert as Vue.PluginObject<unknown>);
Vue.use(MdDialogConfirm as Vue.PluginObject<unknown>);
Vue.use(MdDialog as Vue.PluginObject<unknown>);
Vue.use(MdIcon as Vue.PluginObject<unknown>);
Vue.use(MdList as Vue.PluginObject<unknown>);
Vue.use(MdProgress as Vue.PluginObject<unknown>);
Vue.use(MdSteppers as Vue.PluginObject<unknown>);
Vue.use(MdSubheader as Vue.PluginObject<unknown>);
Vue.use(MdTable as Vue.PluginObject<unknown>);
Vue.use(MdToolbar as Vue.PluginObject<unknown>);

new Vue({
  i18n: I18n,
  el: "#app",
  components: {
    App,
  },
  render: (h): Vue.VNode => h(App),
});
