import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'
import "material-design-icons/iconfont/material-icons.css";
import '@mdi/font/css/materialdesignicons.css' 
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
});

const app = createApp(App)

app.use(store)
app.use(vuetify)

app.mount('#app')
