import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './workers/register_service_worker'
/* import firebase from 'firebase'
import firebaseConfig from '@/config/firebase'

firebase.initializeApp(firebaseConfig) */
const me = localStorage.me
if (!me) localStorage.me = '/+'

createApp(App).use(router).mount('body')
