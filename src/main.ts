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
)

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDFGdlu8fLVe0osO_OYCewHU0UA0wmlaLE',
  authDomain: 'ubiqueme-system.firebaseapp.com',
  projectId: 'ubiqueme-system',
  storageBucket: 'ubiqueme-system.firebasestorage.app',
  messagingSenderId: '313357118395',
  appId: '1:313357118395:web:399c08ecb384cd4570f29e',
  measurementId: 'G-3XT4RFF2Q0',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

export { auth, db }

const app = createApp(App)

app.component('v-icon', OhVueIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
