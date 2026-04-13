import './syles.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  FaFlag,
  RiZhihuFill,
  CoHome,
  CoUser,
  CoQrCode,
  CoSettings,
  IoLogOut,
  BiQuestionCircle,
  FaBell,
  IoLogIn,
  RiLogoutBoxRLine,
  MdHomeRound,
  MdQrcodescannerRound,
  MdNotificationsnoneOutlined,
  MdSettings,
  MdHelpSharp,
} from 'oh-vue-icons/icons'

addIcons(
  FaFlag,
  RiZhihuFill,
  CoHome,
  CoUser,
  CoQrCode,
  CoSettings,
  IoLogOut,
  BiQuestionCircle,
  FaBell,
  IoLogIn,
  RiLogoutBoxRLine,
  MdHomeRound,
  MdQrcodescannerRound,
  MdNotificationsnoneOutlined,
  MdSettings,
  MdHelpSharp,
)

const app = createApp(App)

app.component('v-icon', OhVueIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
