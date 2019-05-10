import Vue from 'vue';
import {MdApp, MdButton, MdCheckbox, MdContent, MdDialogConfirm, MdDialog, MdIcon, MdList, MdProgress, MdSteppers, MdSubheader, MdToolbar} from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'

import App from './App.vue';

Vue.use(MdApp);
Vue.use(MdButton);
Vue.use(MdCheckbox);
Vue.use(MdContent);
Vue.use(MdDialogConfirm);
Vue.use(MdDialog);
Vue.use(MdIcon);
Vue.use(MdList);
Vue.use(MdProgress);
Vue.use(MdSteppers);
Vue.use(MdSubheader);
Vue.use(MdToolbar);

new Vue({
	el: '#app',
	components: {
		App
	},
	render: (h): Vue.VNode => h(App)
});
