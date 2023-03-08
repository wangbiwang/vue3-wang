import { queuePreFlushCb } from '@vue/runtime-core'
import { hasChanged, isObjeact } from '@vue/shared'
import { ReactiveEffect } from 'packages/reactivity/src/effect'
import { isReactive } from 'packages/reactivity/src/reactive'
import { isRef } from 'packages/reactivity/src/ref'

export interface WatchOptions<immediate = boolean> {
    immediate?: immediate
    deep?: boolean
}
export function watch(source, cb: Function, options?: WatchOptions) {
    return doWatch(source, cb, options)
}
function doWatch(source, cb: Function, { immediate, deep }: WatchOptions = {}) {
    let getter: () => any
    if (isReactive(source)) {
        getter = () => source
        deep = true
    } else if (isRef(source)) {
        getter = () => source.value
        if (isReactive(source.value)) deep = true
    } else {
        getter = () => {}
    }
    if (cb && deep) {
        // debugger
        const baseGetter = getter
        getter = () => traverse(baseGetter())
    }
    let oldValue = {}
    const job = () => {
        if (cb) {
            const newValue = effect.run()
            if (deep || hasChanged(newValue, oldValue)) {
                cb(newValue, oldValue)
                oldValue = newValue
            }
        }
    }
    let scheduler = () => queuePreFlushCb(job)
    const effect = new ReactiveEffect(getter, scheduler)
    if (cb) {
        if (immediate) {
            job()
        } else {
            oldValue = effect.run()
        }
    } else {
        effect.run()
    }
    return () => {
        effect.stop()
    }
}
export function traverse(value: unknown) {
    // debugger
    if (!isObjeact(value)) {
        return value
    }
    for (const key in value as object) {
        traverse((value as object)[key])
    }
    return value
}
