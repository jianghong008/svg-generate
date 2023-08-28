<script setup lang="ts">
import { exportObeject } from '@/objects/ObjectUtils'
import { useStage } from '../store/stage';

const stage = useStage()
function exportFile() {
    exportObeject(stage.elements);
}
</script>
<template>
    <div class="tools-box contr">
        <span @click="exportFile">导出</span>
    </div>
</template>
<style lang="css" scoped>
.tools-box {
    background-color: #242424;
    border-radius: 0.3rem;
    padding: 1rem 1.5rem;
    margin-bottom: 0.1rem;
    text-align: right;
}
</style>