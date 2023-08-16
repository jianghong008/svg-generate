<script setup lang="ts">
import Editor from './components/Editor.vue'
window.oncontextmenu = (e)=>{
  e.preventDefault();
}
</script>

<template>
  <Editor/>
</template>

<style>
.contr{
    user-select: none;
}
</style>
