import Vue from 'vue';
import {MdApp, MdButton, MdCheckbox, MdContent, MdDialogAlert, MdDialogConfirm, MdDialog, MdIcon, MdList, MdProgress, MdSteppers, MdSubheader, MdToolbar} from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'

import App from './App.vue';
import I18n from './I18n';

Vue.use(MdApp);
Vue.use(MdButton);
Vue.use(MdCheckbox);
Vue.use(MdContent);
Vue.use(MdDialogAlert);
Vue.use(MdDialogConfirm);
Vue.use(MdDialog);
Vue.use(MdIcon);
Vue.use(MdList);
Vue.use(MdProgress);
Vue.use(MdSteppers);
Vue.use(MdSubheader);
Vue.use(MdToolbar);

new Vue({
	i18n: I18n,
	el: '#app',
	components: {
		App
	},
	render: (h): Vue.VNode => h(App)
});
