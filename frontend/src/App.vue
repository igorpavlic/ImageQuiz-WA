<template>
  <div class="container">
    <Header />

    <nav v-if="user" class="nav-bar">
      <router-link to="/quiz" class="nav-link">Quiz</router-link>
      <router-link to="/highscore" class="nav-link">Highscores</router-link>
      <router-link v-if="user.role === 'admin'" to="/admin" class="nav-link nav-link--admin">Admin</router-link>
    </nav>

    <router-view />

    <div v-if="user" class="player-bar">
      <div class="player-info">
        <div class="avatar">{{ user.email.substring(0, 2).toUpperCase() }}</div>
        <span class="player-email">{{ user.email }}</span>
      </div>
      <button class="btn-secondary" @click="logout">Log Out</button>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const router = useRouter()
const user = ref(null)

const loadUser = () => {
  const savedUser = localStorage.getItem('user')
  const token = localStorage.getItem('token')
  if (savedUser && token) {
    user.value = JSON.parse(savedUser)
  } else {
    user.value = null
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  user.value = null
  router.push('/login')
}

watch(() => router.currentRoute.value, () => {
  loadUser()
})

onMounted(() => {
  loadUser()
})
</script>

<style>
  @import './assets/main.css';
</style>
