<template>
  <div>
    <h2>Register</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" placeholder="Password" type="password" @keyup.enter="register" />
    <button @click="register">Register</button>
    <p style="color: red">{{ error }}</p>
    <p><button @click="$emit('toggle')">Have an account? Log In!</button></p>
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
