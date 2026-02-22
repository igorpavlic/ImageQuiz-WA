<template>
  <div class="auth-card">
    <h2>Welcome back</h2>
    <p class="subtitle">Log in to continue playing</p>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" @keyup.enter="login" />
    <p v-if="error" class="error-text">{{ error }}</p>
    <button class="btn-primary" @click="login">Log In →</button>
    <button class="toggle-link" @click="$emit('toggle')">No account? <span>Register</span></button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/index.js'

const email = ref('')
const password = ref('')
const error = ref('')

const emit = defineEmits(['authenticated', 'toggle'])

const login = async () => {
  error.value = ''
  try {
    const { data } = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    emit('authenticated', data.user)
  } catch (e) {
    error.value = e.response?.data?.error || 'Login failed.'
  }
}
</script>
