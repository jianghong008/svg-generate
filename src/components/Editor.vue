<script setup lang="ts">
import Tools from './Tools.vue'
import Left from './Left.vue'
import Right from './Right.vue'
import Stage from './Stage.vue'
import TimeLine from './TimeLine.vue'
</script>
<template>
    <div class="editor">
        <Tools class="tools" />
        <Left class="left" />
        <Stage class="stage" />
        <Right class="right" />
        <TimeLine class="time-line"/>
    </div>
</template>
<style scoped>
.editor {
    display: grid;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}
.tools{
    grid-column: 1/8;
    grid-row: 1/1;
    height: 4rem;
}
.left{
    grid-column: 1/1;
    width: 10vw;
}
.right{
    grid-column: 6/8;
    width: 20vw;
}
.left,.stage,.right{
    grid-row: 2/16;
    height: calc(100vh - 12rem);
}
.stage{
    grid-column: 2/6;
    width: 70vw;
}
.time-line{
    grid-column: 2/6;
    grid-row: 16/18;
    height: 8rem;
}
</style>