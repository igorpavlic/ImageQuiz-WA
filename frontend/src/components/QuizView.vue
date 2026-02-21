<template>
  <div>
    <div>
      <div v-if="isLoading" class="wrapper">
        <h2>Generating image...</h2>
        <div class="spinner-circle"></div>
      </div>
      <div v-else class="wrapper">
        <h2>What do you see?</h2>
        <img :src="imageUrl" />
        <p class="answer-popup">{{ result }}</p>
      </div>
    </div>
    <div>
      <input v-model="userAnswer" placeholder="Write here" @keyup.enter="handleEnterPress" ref="answerInput"/>
      <button @click="checkAnswer" :disabled="isLoading">Check</button>
      <p>Points: {{ score }}</p>
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
    result.value = '✅ Correct!'
    score.value++
    try {
      await api.patch('/quiz/score', { score: score.value })
    } catch (err) {
      console.error('Error updating score:', err)
    }
  } else {
    result.value = `❌ Wrong. Correct answer: ${correctWord.value}`
  }
  setTimeout(loadNewImage, 1000)
}

onMounted(async () => {
  await loadScore()
  await loadNewImage()
})
</script>
