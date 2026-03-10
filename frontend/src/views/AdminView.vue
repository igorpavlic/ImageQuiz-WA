<template>
  <div class="admin-page">
    <h2 class="page-title">Admin Panel</h2>
    <p class="page-subtitle">Manage quiz words</p>
    <AdminPanel />
  </div>
</template>

<script setup>
import AdminPanel from '../components/AdminPanel.vue'
</script>

<style scoped>
.admin-page {
  margin-bottom: 16px;
}

.page-title {
  font-family: 'Fraunces', serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
  text-align: center;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 0.85rem;
  color: var(--text-dim);
  text-align: center;
  margin-bottom: 20px;
}
</style>
