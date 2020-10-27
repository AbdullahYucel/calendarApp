import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueTextareaAutosize from 'vue-textarea-autosize'
import firebase from 'firebase/app'
import 'firebase/firestore'


Vue.use(VueTextareaAutosize)

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyABXup8YZcubyj6gg_OSy5XRXRTs6CaTAo",
    authDomain: "vue-project-2a76d.firebaseapp.com",
    databaseURL: "https://vue-project-2a76d.firebaseio.com",
    projectId: "vue-project-2a76d",
    storageBucket: "vue-project-2a76d.appspot.com",
    messagingSenderId: "154970851081",
    appId: "1:154970851081:web:6ce0be4ad8a32749fd75d8"
})

export const db=firebase.firestore()

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
