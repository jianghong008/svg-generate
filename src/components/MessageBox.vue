<script setup lang="ts">
import { useSystem } from '@/store/sys';

const { message } = useSystem()
</script>
<template>
    <div class="message-box" :class="{ hide: !message.show }">
        <p>{{ message.text }}</p>
    </div>
</template>
<style lang="css" scoped>
.message-box {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 100;
    transition: all 600ms;
}

.hide {
    transform: translateY(100%);
}

.message-box p {
    padding: 1rem 0;
}
</style>
