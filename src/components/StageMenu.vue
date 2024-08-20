<script setup lang="ts">
import { ElementObject, PathDrawMethod, UseObject } from '@/objects/ElementObject';
import { SvgObject } from '@/objects/StageObject';
import { useStage } from '@/store/stage'
import { reactive, ref, watch } from 'vue';
const { menus, currentObject, removeElement, groupObjects, ungroupObject } = useStage()
const list = reactive([
    {
        title: '删除',
        show: false,
        active: false
    },
    {
        title: '打组',
        show: false,
        active: false
    },
    {
        title: '解组',
        show: false,
        active: false
    },
    {
        title: '转为平滑点',
        show: false,
        active: false
    },
    {
        title: '转为直角点',
        show: false,
        active: false
    }
])
const menuBox = ref<HTMLElement>()
watch(menus, () => {
    resetMenus();
    if (currentObject.element instanceof ElementObject && !(currentObject.element instanceof SvgObject)) {
        list[0].active = true;
        list[0].show = true;

    }
    if (menus.arg !== -1 && typeof menus.arg === 'number') {
        const point = currentObject.element?.path[menus.arg];
        if (!point) {
            return
        }
        list[0].active = false;
        if (point.method === PathDrawMethod.L) {
            list[3].active = true;
            list[3].show = true;
        } else if (point.method === PathDrawMethod.Q) {
            list[4].active = true;
            list[4].show = true;
        }
    }

    if (currentObject.elements.length > 1) {
        list[1].active = true;
        list[1].show = true;
    }
    if ((currentObject.elements.length == 1 && currentObject.elements[0] instanceof UseObject) || currentObject.element instanceof UseObject) {
        list[2].active = true;
        list[2].show = true;
    }

})
function resetMenus() {
    for (const m of list) {
        m.active = false;
        m.show = false;
    }
}
function menuAction(index: number) {
    menus.show = false;
    const m = list[index];
    if (!m.active || !m.show) {
        return
    }
    if (index == 0) {
        //删除
        removeElement(currentObject.element?.id);
    } else if (index == 1) {
        //打组
        groupObjects();
    } else if (index == 2) {
        //解组
        ungroupObject(currentObject.element?.id);
    } else if (index == 3) {
        //平滑点
        const point = currentObject.element?.path[menus.arg];
        if (!point) {
            return
        }
        point.method = PathDrawMethod.C;
        const p1 = { x: point.point[0].x - 10, y: point.point[0].y - 10 };
        const p2 = { x: point.point[0].x, y: point.point[0].y };
        const p3 = { x: point.point[0].x + 10, y: point.point[0].y + 10 };
        point.point = [p1, p2, p3];
    } else if (index == 4) {
        //直角点
        const point = currentObject.element?.path[menus.arg];
        if (!point) {
            return
        }
        point.method = PathDrawMethod.L;
        const p = { x: point.point[0].x, y: point.point[0].y };
        point.point = [p];
    }
}
</script>
<template>
    <div class="menu-box" v-show="menus.show" :style="{ top: menus.y + 'px', left: menus.x + 'px' }">
        <ol ref="menuBox" class="menu">
            <li v-for="(m, i) in list" :key="i" v-show="m.show" :class="{ 'disabled': !m.active }"
                @click="menuAction(i)">
                {{ m.title }}
            </li>
        </ol>
    </div>
</template>
<style scoped>
.menu-box {
    position: absolute;
    user-select: none;
    left: 0;
    top: 0;
}

.menu {
    background-color: #454545;
    box-shadow: 1px 1px 2px rgba(255, 255, 255, 0.4);
    list-style: none;
    text-align: left;
    padding: 0;
    margin: 0;
    min-width: 110px;
}

.menu li {
    padding: 0.5rem;
}

.disabled {
    color: #c5c5c5;
}

.menu li:not(.disabled):hover {
    background: #00608c;

}
</style>