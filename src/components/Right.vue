<script setup lang="ts">
import { useStage } from '@/store/stage';

const {currentObject} = useStage();

</script>
<template>
    <div class="right">
        <h3>属性</h3>
        <div class="right-plane" v-if="currentObject.element">
            <h3>{{ currentObject.element.type }}</h3>
            <div class="right-plane-item">
                <span>横向距离X</span>
                <input type="number" v-model="currentObject.element.x">
            </div>
            <div class="right-plane-item">
                <span>纵向距离Y</span>
                <input type="number" v-model="currentObject.element.y">
            </div>
            <div class="right-plane-item">
                <span>画笔大小</span>
                <input type="number" v-model="currentObject.element.strokeWidth">
            </div>
            <div class="right-plane-item">
                <span>画笔颜色</span>
                <input type="color" v-model="currentObject.element.stroke">
            </div>
            <div class="right-plane-item">
                <span>填充</span>
                <input type="color" v-model="currentObject.element.fill">
            </div>
        </div>
    </div>
</template>
<style scoped>
.right-plane-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    
}
.right-plane-item span{
    user-select: none;
}
.right-plane-item input{
    max-width: 100%;
}
</style>