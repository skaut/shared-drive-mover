import Vue from 'vue';
import App from './App.vue';

Vue.use(VueMaterial.default);

var app = new Vue({
  el: '#app',
  components: {
    App
  },
  methods: {
    getFolders: function()
    {
      this.$children[0].getFolders();
    },
    getSharedDrives: function()
    {
      this.$children[0].getSharedDrives();
    }
  },
  render: function(createElement)
  {
    return createElement(App);
  }
});

app.getFolders();
app.getSharedDrives();
