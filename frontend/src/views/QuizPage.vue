<template>
  <div>
    <DataProvider 
      @wordsLoaded="handleWordsLoaded" 
      @imageFetcherReady="setImageFetcher"
    />

    <QuizView 
      v-if="wordList.length && fetchImage" 
      :wordList="wordList" 
      :fetchImage="fetchImage" 
    />

    <div v-else-if="!wordList.length" class="loading-state">
      <p>Loading quiz data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataProvider from '../components/DataProvider.vue'
import QuizView from '../components/QuizView.vue'

const wordList = ref([])
const fetchImage = ref(null)

const handleWordsLoaded = (words) => {
  wordList.value = words
}

const setImageFetcher = (fetcher) => {
  fetchImage.value = fetcher
}
</script>
