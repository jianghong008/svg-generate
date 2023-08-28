<script setup lang="ts">
import Editor from './components/Editor.vue'
window.oncontextmenu = (e)=>{
  e.preventDefault();
}
</script>

<template>
  <Editor class="eidtor-warp"/>
</template>

<style>
.eidtor-warp{
  background-color: #121212;
  color: #fff;
}
.contr{
    user-select: none;
}
</style>
