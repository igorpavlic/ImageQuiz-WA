<template>
  <div>
    <button class="btn-highscore" @click="openModal">➕ Add Words</button>

    <!-- Modal Overlay -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>➕ Add Words</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <div class="modal-body">
          <p class="modal-hint">Enter words separated by commas or spaces</p>
          <textarea
            v-model="Words2Add"
            rows="5"
            placeholder="dog, car, ball, house, tree..."
          ></textarea>
          <button class="btn-primary" @click="addWords" :disabled="!Words2Add.trim()">
            Add Words
          </button>

          <div v-if="Words2AddSuccess" class="result-toast correct">
            ✅ {{ addedCount }} words added!
          </div>
          <div v-if="errorMsg" class="result-toast wrong">
            ❌ {{ errorMsg }}
          </div>

          <!-- Word list -->
          <div v-if="allWords.length" class="word-list-section">
            <div class="word-list-header">
              <span class="modal-hint">{{ allWords.length }} words in database</span>
            </div>
            <div class="word-list">
              <div v-for="w in allWords" :key="w.id" class="word-chip">
                <span>{{ w.word }}</span>
                <button class="chip-delete" @click="deleteWord(w.id)" title="Delete">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/index.js'

const showModal = ref(false)
const Words2Add = ref('')
const Words2AddSuccess = ref(false)
const addedCount = ref(0)
const errorMsg = ref('')
const allWords = ref([])

const openModal = () => {
  showModal.value = true
  loadWords()
}

const closeModal = () => {
  showModal.value = false
}

const loadWords = async () => {
  try {
    const { data } = await api.get('/admin/words')
    allWords.value = data
  } catch (err) {
    console.error('Error loading words:', err)
  }
}

const addWords = async () => {
  errorMsg.value = ''
  Words2AddSuccess.value = false

  let words = Words2Add.value
    .split(/[\s,]+/)
    .map(w => w.toLowerCase().trim())
    .filter(w => w.length > 1)
  words = [...new Set(words)]

  if (words.length === 0) {
    errorMsg.value = 'No valid words entered.'
    return
  }

  try {
    const { data } = await api.post('/admin/words', { words })
    addedCount.value = data.added
    Words2Add.value = ''
    Words2AddSuccess.value = true
    loadWords()
    setTimeout(() => (Words2AddSuccess.value = false), 3000)
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Failed to add words.'
  }
}

const deleteWord = async (id) => {
  try {
    await api.delete(`/admin/words/${id}`)
    allWords.value = allWords.value.filter(w => w.id !== id)
  } catch (err) {
    console.error('Error deleting word:', err)
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
  max-width: 420px;
  max-height: 85vh;
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

.modal-hint {
  font-size: 0.85rem;
  color: var(--text-dim, #9a918a);
  margin-bottom: 12px;
}

.modal-body textarea {
  width: 100%;
  min-height: 100px;
  background: var(--bg, #faf8f5);
  border: 2px solid var(--border, #e8e4df);
  border-radius: 14px;
  padding: 14px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  color: var(--text, #2a2522);
  outline: none;
  resize: vertical;
  margin-bottom: 12px;
  transition: border-color 0.2s;
}

.modal-body textarea:focus {
  border-color: var(--accent, #e86833);
  box-shadow: 0 0 0 4px var(--accent-light, #fff0e8);
}

.modal-body textarea::placeholder {
  color: var(--text-dim, #9a918a);
}

.result-toast {
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  margin-top: 12px;
  text-align: center;
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-toast.correct {
  background: var(--correct-bg, #e8f5ee);
  color: var(--correct, #2d8a56);
}

.result-toast.wrong {
  background: var(--wrong-bg, #fce8e8);
  color: var(--wrong, #c9302c);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Word list */
.word-list-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border, #e8e4df);
}

.word-list-header {
  margin-bottom: 10px;
}

.word-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.word-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg, #faf8f5);
  border: 1px solid var(--border, #e8e4df);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 0.8rem;
  color: var(--text, #2a2522);
  transition: all 0.15s;
}

.word-chip:hover {
  border-color: var(--wrong, #c9302c);
}

.chip-delete {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-dim, #9a918a);
  font-size: 0.7rem;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.15s;
  padding: 0;
  font-family: inherit;
}

.chip-delete:hover {
  background: var(--wrong, #c9302c);
  color: white;
}
</style>