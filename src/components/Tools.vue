<script setup lang="ts">
import { ElementObjectType } from '@/objects/ElementObject';
import { useStage } from '../store/stage';

const stage = useStage()
function reset_mouse(){
    stage.mouse.curElType = ElementObjectType.none;
}
</script>
<template>
    <div class="contr">
        <span @click="reset_mouse">选择</span>
    </div>
</template>