<template>
  <Login @authenticated="onLogin" @toggle="goToRegister" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import Login from '../components/Login.vue'

const router = useRouter()

const onLogin = (userData) => {
  router.push('/quiz')
}

const goToRegister = () => {
  router.push('/register')
}
</script>
