import Vue from 'vue';
import App from './App.vue';

Vue.use(VueMaterial.default);

new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App></App>'
});
