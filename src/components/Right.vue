<script setup lang="ts">
import { useStage } from '@/store/stage';

const {currentObject} = useStage();

</script>
<template>
    <div>
        <h3>属性</h3>
        <div class="plane" v-if="currentObject.element">
            <h3>{{ currentObject.element.type }}</h3>
            <div>
                <span>x: </span>
                <input type="number" v-model="currentObject.element.x">
            </div>
            <div>
                <span>y: </span>
                <input type="number" v-model="currentObject.element.y">
            </div>
            <div>
                <span>画笔大小: </span>
                <input type="number" v-model="currentObject.element.strokeWidth">
            </div>
            <div>
                <span>画笔颜色: </span>
                <input type="color" v-model="currentObject.element.stroke">
            </div>
            <div>
                <span>填充: </span>
                <input type="color" v-model="currentObject.element.fill">
            </div>
        </div>
    </div>
</template>
<style scoped>
.plane input{
    width: 3rem;
}
</style>