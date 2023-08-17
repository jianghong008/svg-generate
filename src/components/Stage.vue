<script setup lang="ts">
import StagePoints from './StagePoints.vue'
import SvgEl from './svg/SvgEl.vue'
import { useStage } from '../store/stage'

const stage = useStage()

function box_mouseup() {
    if (stage.mouse.down) {
        stage.stopMoveElement();
        stage.mouse.down = false;
    }

}


function mousemove(e: MouseEvent) {
    if (!stage.mouse.down) {
        return
    }

    stage.moveElement(e.offsetX, e.offsetY)
}
function stage_contextmenu(e: MouseEvent) {
    e.preventDefault();
}
</script>
<template>
    <div class="stage-warp" @mousemove="mousemove" @mouseup="box_mouseup" @contextmenu="stage_contextmenu">
        <div class="svg-box">
            <SvgEl/>
            <StagePoints />
        </div>
    </div>
</template>
<style scoped>
.stage-warp {
    display: flex;
    justify-content: center;
    align-items: center;
}

svg {
    border: dashed 1px gray;
}

.el-active {
    outline: dashed 1px #FF5722;
}

.svg-box {
    position: relative;
}
</style>