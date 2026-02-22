<template>
  <div>
    <!-- Score Strip -->
    <div class="score-strip">
      <div class="score-left">
        <div class="score-number">{{ score }}</div>
        <div class="score-label">Points</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="wrapper">
      <h2>Generating image...</h2>
      <div class="spinner-circle"></div>
    </div>

    <!-- Image Card -->
    <div v-else class="image-card">
      <div class="image-wrapper">
        <img :src="imageUrl" alt="Quiz image" />
      </div>
      <div class="image-footer">
        <span class="label">👁️ What do you see?</span>
        <span class="hint">Type below</span>
      </div>
    </div>

    <!-- Result -->
    <p v-if="result" class="answer-popup">{{ result }}</p>

    <!-- Answer Input -->
    <div class="answer-section">
      <input 
        v-model="userAnswer" 
        type="text"
        placeholder="Your answer..." 
        @keyup.enter="handleEnterPress" 
        ref="answerInput"
        style="margin-bottom: 0;"
      />
      <button class="btn-check" @click="checkAnswer" :disabled="isLoading">Check →</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/index.js'

const imageUrl = ref('')
const correctWord = ref('')
const userAnswer = ref('')
const result = ref('')
const score = ref(0)
const isLoading = ref(false)
const answerInput = ref(null)

const props = defineProps({
  wordList: Array,
  fetchImage: Function
})

const loadScore = async () => {
  try {
    const { data } = await api.get('/quiz/score')
    score.value = data.score || 0
  } catch (err) {
    console.error('Error loading score:', err)
  }
}

const loadNewImage = async () => {
  isLoading.value = true
  correctWord.value = props.wordList[Math.floor(Math.random() * props.wordList.length)]
  imageUrl.value = await props.fetchImage(correctWord.value)
  userAnswer.value = ''
  result.value = ''
  isLoading.value = false
}

const handleEnterPress = () => {
  if (!isLoading.value && userAnswer.value.trim()) {
    checkAnswer()
  }
}

const checkAnswer = async () => {
  if (userAnswer.value.toLowerCase() === '') {
    result.value = '⚠️ Please enter an answer and try again.'
    return
  }
  if (userAnswer.value.toLowerCase() === correctWord.value.toLowerCase()) {
    result.value = '✅ Correct! Nice one!'
    score.value++
    try {
      await api.patch('/quiz/score', { score: score.value })
    } catch (err) {
      console.error('Error updating score:', err)
    }
  } else {
    result.value = `❌ Wrong. The answer was: ${correctWord.value}`
  }
  setTimeout(loadNewImage, 1000)
}

onMounted(async () => {
  await loadScore()
  await loadNewImage()
})
</script>
