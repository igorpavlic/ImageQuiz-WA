<template>
  <div class="container">
    <Header />
    <div v-if="!authChecked">
      <p>Loading...</p>
    </div>

    <Login
      v-else-if="!user && mode === 'login'"
      @authenticated="onLogin"
      @toggle="toggleMode"
    />

    <Register
      v-else-if="!user && mode === 'register'"
      @authenticated="onLogin"
      @toggle="toggleMode"
    />

    <div v-else>
      <DataProvider 
        @wordsLoaded="handleWordsLoaded" 
        @imageFetcherReady="setImageFetcher"
      />

      <QuizView 
        v-if="wordList.length && fetchImage" 
        :wordList="wordList" 
        :fetchImage="fetchImage" 
      />

      <div class="player-bar">
        <div class="player-info">
          <div class="avatar">{{ user.email.substring(0, 2).toUpperCase() }}</div>
          <span class="player-email">{{ user.email }}</span>
        </div>
        <button class="btn-secondary" @click="logout">Log Out</button>
      </div>

      <AdminPanel v-if="user.role === 'admin'" />
      <Highscore :currentUser="user" />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import QuizView from './components/QuizView.vue'
import AdminPanel from './components/AdminPanel.vue'
import DataProvider from './components/DataProvider.vue'
import Header from './components/Header.vue'
import Highscore from './components/Highscore.vue'
import Footer from './components/Footer.vue'

const user = ref(null)
const authChecked = ref(false)
const wordList = ref([])
const fetchImage = ref(null)
const mode = ref('login')

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
}

const onLogin = (userData) => {
  user.value = userData
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  user.value = null
}

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  const token = localStorage.getItem('token')
  if (savedUser && token) {
    user.value = JSON.parse(savedUser)
  }
  authChecked.value = true
})

const handleWordsLoaded = (words) => {
  wordList.value = words
}

const setImageFetcher = (fetcher) => {
  fetchImage.value = fetcher
}
</script>

<style>
  @import './assets/main.css'
</style>
