<script setup lang="ts">
import JustMenu from './components/JustMenu.vue';
</script>



<template>
    <JustMenu />
    <router-view />
</template>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>./components/JustMenu.vue