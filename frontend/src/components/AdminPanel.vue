<template>
  <div class="admin-panel">
    <a href="#" @click.prevent="showForm = !showForm">
      {{ showForm ? '❌ Close Add Words' : '➕ Add Words' }}
    </a>

    <div v-if="showForm" class="form-popup">
      <textarea
        v-model="Words2Add"
        rows="6"
        cols="40"
        placeholder="like: dog, car, ball, ..."
      ></textarea>
      <br />
      <button @click="addWords">Add Words</button>
      <p style="color: green" v-if="Words2AddSuccess">✅ Words Added!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/index.js'

const emit = defineEmits(['refresh'])

const Words2Add = ref('')
const Words2AddSuccess = ref(false)
const showForm = ref(false)

const addWords = async () => {
  let words = Words2Add.value
    .split(/[\s,]+/)
    .map(w => w.toLowerCase().trim())
    .filter(w => w.length > 1)
  words = [...new Set(words)]

  try {
    await api.post('/admin/words', { words })
    Words2Add.value = ''
    Words2AddSuccess.value = true
    emit('refresh')
    setTimeout(() => (Words2AddSuccess.value = false), 2000)
  } catch (err) {
    console.error('Error adding words:', err)
  }
}
</script>
