import Vue from 'vue'
import App from './App.vue'

// Import Bootstrap Vue

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
