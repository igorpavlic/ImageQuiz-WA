<template>
  <footer>
    <p>&copy; {{ year }} Igor Pavlić</p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
