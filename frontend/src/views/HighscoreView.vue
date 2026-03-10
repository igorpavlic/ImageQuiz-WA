<template>
  <div class="highscore-page">
    <h2 class="page-title">Top Players</h2>
    <p class="page-subtitle">See who's leading the quiz</p>

    <div v-if="isLoading" class="loading">
      <div class="spinner-circle"></div>
      <p>Loading scores...</p>
    </div>

    <div v-else-if="topPlayers.length === 0" class="no-scores">
      <p>No scores yet. Be the first to play!</p>
    </div>

    <div v-else class="scores-card">
      <div 
        v-for="(player, index) in topPlayers" 
        :key="player.id"
        class="score-item"
        :class="{ 'current-user': player.email === currentUserEmail }"
      >
        <span class="rank">
          {{ index + 1 }}{{ getRankSuffix(index + 1) }}
        </span>
        <span class="player-email">{{ player.email }}</span>
        <span class="score">{{ player.score }} pts</span>
      </div>

      <div v-if="userRank && userRank.rank > 10" class="current-user-rank">
        <div class="divider">...</div>
        <div class="score-item current-user">
          <span class="rank">{{ userRank.rank }}{{ getRankSuffix(userRank.rank) }}</span>
          <span class="player-email">{{ userRank.email }}</span>
          <span class="score">{{ userRank.score }} pts</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/index.js'

const topPlayers = ref([])
const userRank = ref(null)
const isLoading = ref(true)

const user = JSON.parse(localStorage.getItem('user') || 'null')
const currentUserEmail = computed(() => user?.email || '')

const loadHighscores = async () => {
  isLoading.value = true
  try {
    const { data } = await api.get('/highscore')
    topPlayers.value = data

    if (user?.id) {
      const rankRes = await api.get(`/highscore/rank/${user.id}`)
      userRank.value = rankRes.data
    }
  } catch (error) {
    console.error('Error loading highscores:', error)
  } finally {
    isLoading.value = false
  }
}

const getRankSuffix = (rank) => {
  if (rank % 100 >= 11 && rank % 100 <= 13) return 'th'
  switch (rank % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

onMounted(() => {
  loadHighscores()
})
</script>

<style scoped>
.highscore-page {
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

.scores-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 16px;
  box-shadow: var(--shadow-lg);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: var(--text-dim);
}
</style>
