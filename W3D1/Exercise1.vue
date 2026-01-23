<template>
  <div class="exercise-container">
    <h2>Personal Greeting</h2>
    
    <div class="form-group">
      <label>Name: <input v-model="name" type="text" placeholder="Enter your name" /></label>
    </div>
    
    <div class="form-group">
      <label>Age: <input v-model="age" type="number" placeholder="Enter your age" /></label>
    </div>
    
    <div class="form-group">
      <label>City: <input v-model="city" type="text" placeholder="Enter your city" /></label>
    </div>

    <button @click="updateGreeting">Update Greeting</button>

    <p v-if="greeting" class="greeting-text">
      {{ greeting }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('');
const age = ref('');
const city = ref('');
const greeting = ref('');

const updateGreeting = () => {
  greeting.value = `Hello, my name is ${name.value}. I am ${age.value} years old and I live in ${city.value}.`;
};
</script>

<style scoped>
.form-group {
  margin-bottom: 10px;
}
.greeting-text {
  font-weight: bold;
  color: #2c3e50;
  margin-top: 15px;
}
</style>