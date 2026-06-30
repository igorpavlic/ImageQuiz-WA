<template>
  <div style="display: none"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import api from '../api/index.js'

const DEEPAI_API_KEY = import.meta.env.VITE_DEEPAI_API_KEY

// Emits
const emit = defineEmits(['wordsLoaded', 'imageFetcherReady'])

// Fetch words from Express API
const loadWords = async () => {
  try {
    const { data } = await api.get('/quiz/words')
    emit('wordsLoaded', data)
  } catch (err) {
    console.error('Error loading words:', err)
    emit('wordsLoaded', [])
  }
}

// Generate image using DeepAI API
const fetchImage = async (prompt) => {
  const response = await fetch('https://api.deepai.org/api/text2img', {
    method: 'POST',
    headers: {
      'Api-Key': DEEPAI_API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ text: prompt })
  })

  const data = await response.json()
  return data.output_url || ''
}

// Init on mount
onMounted(() => {
  loadWords()
  emit('imageFetcherReady', fetchImage)
})
</script>
