<template>
  <div>
    <button class="btn-highscore" @click="openModal">🏆 Highscores</button>

    <!-- Modal Overlay -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>🏆 Top Players</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <div class="modal-body">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../api/index.js'

const props = defineProps({
  currentUser: Object
})

const showModal = ref(false)
const topPlayers = ref([])
const userRank = ref(null)
const isLoading = ref(false)

const currentUserEmail = computed(() => props.currentUser?.email || '')

const openModal = () => {
  showModal.value = true
  loadHighscores()
}

const closeModal = () => {
  showModal.value = false
}

const loadHighscores = async () => {
  isLoading.value = true
  try {
    const { data } = await api.get('/highscore')
    topPlayers.value = data

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
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(42, 37, 34, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #e8e4df);
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 50px rgba(42, 37, 34, 0.15);
  animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border, #e8e4df);
}

.modal-header h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
  color: var(--text, #2a2522);
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid var(--border, #e8e4df);
  background: var(--bg, #faf8f5);
  color: var(--text-dim, #9a918a);
  font-size: 1rem;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s;
  font-family: inherit;
}

.modal-close:hover {
  background: var(--wrong-bg, #fce8e8);
  border-color: var(--wrong, #c9302c);
  color: var(--wrong, #c9302c);
}

.modal-body {
  padding: 16px 24px 24px;
  overflow-y: auto;
}

.scores-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.score-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: var(--bg, #faf8f5);
  border-radius: 14px;
  font-size: 0.9rem;
  border-left: 4px solid var(--border, #e8e4df);
  transition: transform 0.15s;
}

.score-item:hover {
  transform: translateX(4px);
}

.score-item:nth-child(1) {
  border-left-color: #f0b429;
  background: linear-gradient(135deg, #fffbeb, #ffffff);
}

.score-item:nth-child(2) {
  border-left-color: #a0aec0;
  background: linear-gradient(135deg, #f7fafc, #ffffff);
}

.score-item:nth-child(3) {
  border-left-color: #c27c3e;
  background: linear-gradient(135deg, #fef6ee, #ffffff);
}

.score-item.current-user {
  border-left-color: var(--accent, #e86833);
  background: var(--accent-light, #fff0e8);
  font-weight: 700;
}

.rank {
  font-weight: 700;
  color: var(--text, #2a2522);
  min-width: 40px;
}

.player-email {
  flex: 1;
  text-align: left;
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;
  color: var(--text-dim, #9a918a);
}

.score {
  font-weight: 700;
  color: var(--correct, #2d8a56);
  font-size: 0.85rem;
}

.current-user-rank {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border, #e8e4df);
}

.divider {
  text-align: center;
  color: var(--text-dim, #9a918a);
  margin-bottom: 8px;
  font-weight: 700;
}

.loading, .no-scores {
  text-align: center;
  color: var(--text-dim, #9a918a);
  padding: 24px 0;
}
</style>