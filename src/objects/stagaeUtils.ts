
import { StageObject, SvgObject } from "./StageObject";

export function deleteCurrentObject(curr: StageObject | null, el: StageObject | SvgObject, mouseArg: any) {
    if (typeof mouseArg === 'string' && mouseArg !== '' && el instanceof SvgObject) {
        el.defs.forEach((e, i) => {
            if (e.id === mouseArg) {
                el.defs.splice(i, 1);
                return
            }
        })
        return
    }
    if (!curr) {
        return
    }
    const id = curr.id;
    el.children.forEach((e, i) => {
        if (e.id === id) {
            el.children.splice(i, 1);
            return
        } else if (e.children.length > 0) {
            deleteCurrentObject(curr, e, mouseArg);
        }
    })

}