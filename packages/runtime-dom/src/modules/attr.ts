export function patchAttr(el: Element, key, value) {
    if (value === null) {
        el.removeAttribute(key)
    }
    el.setAttribute(key, value)
}
