import Vue from 'vue';
import App from './App.vue';

Vue.use(VueMaterial.default);

new Vue({
  el: '#app',
  components: {
    App
  },
  render: h => h(App)
});
