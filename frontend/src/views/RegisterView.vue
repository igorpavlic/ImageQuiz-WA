<template>
  <Register @authenticated="onRegister" @toggle="goToLogin" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import Register from '../components/Register.vue'

const router = useRouter()

const onRegister = (userData) => {
  router.push('/quiz')
}

const goToLogin = () => {
  router.push('/login')
}
</script>
