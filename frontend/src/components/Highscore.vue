<template>
  <div class="highscore-panel">
    <a href="#" @click.prevent="toggleHighscore">
      {{ showHighscore ? '❌ Close Highscore' : '🏆 View Highscores' }}
    </a>

    <div v-if="showHighscore" class="highscore-popup">
      <h3>🏆 Top Players</h3>
      
      <div v-if="isLoading" class="loading">
        <p>Loading scores...</p>
      </div>

      <div v-else-if="topPlayers.length === 0" class="no-scores">
        <p>No scores yet. Be the first to play!</p>
      </div>

      <div v-else class="scores-list">
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

const props = defineProps({
  currentUser: Object
})

const showHighscore = ref(false)
const topPlayers = ref([])
const userRank = ref(null)
const isLoading = ref(false)

const currentUserEmail = computed(() => props.currentUser?.email || '')

const loadHighscores = async () => {
  isLoading.value = true
  try {
    const { data } = await api.get('/highscore')
    topPlayers.value = data

    // Get current user's rank if not in top 10
    if (props.currentUser?.id) {
      const rankRes = await api.get(`/highscore/rank/${props.currentUser.id}`)
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

const toggleHighscore = () => {
  showHighscore.value = !showHighscore.value
  if (showHighscore.value) {
    loadHighscores()
  }
}
</script>
