<template>
  <div class="auth-card">
    <h2>Create account</h2>
    <p class="subtitle">Join and start playing</p>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password (min. 6 characters)" @keyup.enter="register" />
    <p v-if="error" class="error-text">{{ error }}</p>
    <button class="btn-primary" @click="register">Register →</button>
    <button class="toggle-link" @click="$emit('toggle')">Have an account? <span>Log in</span></button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/index.js'

const email = ref('')
const password = ref('')
const error = ref('')

const emit = defineEmits(['authenticated', 'toggle'])

const register = async () => {
  error.value = ''
  try {
    const { data } = await api.post('/auth/register', {
      email: email.value,
      password: password.value
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    emit('authenticated', data.user)
  } catch (e) {
    error.value = e.response?.data?.error || 'Registration failed.'
  }
}
</script>
