// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { aliases, md } from 'vuetify/iconsets/mdi'


export default createVuetify({
  // 任何你想要的配置
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md,
    },
  }
  
})
