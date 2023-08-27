<script setup lang="ts">
import {exportObeject} from '@/objects/ObjectUtils'
import { useStage } from '../store/stage';

const stage = useStage()
function exportFile(){
    exportObeject(stage.elements);
}
</script>
<template>
    <div class="contr">
        <span @click="exportFile">导出</span>
    </div>
</template>