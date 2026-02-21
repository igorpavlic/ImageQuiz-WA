<template>
  <div>
    <h2>Log In</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" placeholder="Password" type="password" @keyup.enter="login" />
    <button @click="login">Log In</button>
    <p style="color: red">{{ error }}</p>
    <p><button @click="$emit('toggle')">No Account? Register!</button></p>
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
