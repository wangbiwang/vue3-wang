import { isString } from '@vue/shared'

export function patchStyle(el: Element, prevValue, nextValue) {
    const style = (el as HTMLElement).style
    const isCssString = isString(nextValue)
    if (nextValue && !isCssString) {
        for (const key in nextValue) {
            setStyle(style, key, nextValue[key])
        }
        if (prevValue && !isString(prevValue)) {
            for (const key in prevValue) {
                setStyle(style, key, '')
            }
        }
    }
}
function setStyle(style: CSSStyleDeclaration, name: string, val: string) {
    style[name] = val
}
