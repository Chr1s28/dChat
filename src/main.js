import { createApp } from 'vue'
import App from './App.vue'
import VueIpfs from './plugins/vue-ipfs'
import MMLogin from './plugins/mm-login'

// Load our IPFS plugin.
const app = createApp(App)
app.use(VueIpfs)
app.use(MMLogin)
app.mount('#app')
