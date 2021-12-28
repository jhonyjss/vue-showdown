<template>
  <main id="realness" :class="status">
    <router-view
      v-if="!working"
      v-model:statement="statement"
      v-model:person="me" />
  </main>
</template>
<script>
  import firebase from 'firebase/app'
  import { get, set } from 'idb-keyval'
  export default {
    data() {
      return {
        working: true,
        me: null,
        statement: null,
        status: null
      }
    },
    computed: {
      is_production() {
        return import.meta.env.MODE === 'production'
      }
    },
    async created() {
      if (this.is_production) {
        const response = await fetch('__/firebase/init.json')
        await set('firebase-keys', await response.json())
      } else {
        const keys = {
          apiKey: import.meta.env.VITE_APP_API_KEY,
          authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
          databaseUrl: import.meta.env.VITE_APP_DATABASE_URL,
          projectId: import.meta.env.VITE_APP_PROJECT_ID,
          storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID
        }
        console.log('keys', keys)
        await set('firebase-keys', keys)
      }
      firebase.initializeApp(await get('firebase-keys'))
      window.addEventListener('online', this.online)
      window.addEventListener('offline', this.offline)
      this.working = false
    },
    beforeUnMount() {
      window.removeEventListener('online', this.online)
      window.removeEventListener('offline', this.offline)
    },
    methods: {
      sync_active(active) {
        if (active) this.status = 'working'
        else this.status = null
      },
      online() {
        const editable = document.querySelectorAll('[contenteditable]')
        editable.forEach(e => e.setAttribute('contenteditable', true))
        this.status = null
      },
      offline() {
        const editable = document.querySelectorAll('[contenteditable]')
        editable.forEach(e => e.setAttribute('contenteditable', false))
        this.status = 'offline'
      }
    }
  }
</script>
<style src="@/style/index.styl" lang="stylus"></style>
<style lang="stylus" scoped>
  main
      &.offline
        border-color: yellow
      &.working
        border-color: green
        animation-name: pulsing
        animation-duration: 5s
        animation-delay: 200ms
        animation-iteration-count: infinite
</style>
