<script setup lang="ts">
import TimeLine from './TimeLine.vue';
import ColorController from './ColorController.vue';
</script>
<template>
    <div class="bottom-box">
        <TimeLine/>
        <ColorController/>
    </div>
</template>
<style scoped>
.bottom-box{
    background-color: #242424;
    border-radius: 0.3rem;
    padding: 1rem 1rem;
    margin-top: 0.1rem;
}
</style>