export function patchDOMProp(el, key, value) {
    try {
        el[key] = value
    } catch (error) {
        console.log(error)
    }
}
