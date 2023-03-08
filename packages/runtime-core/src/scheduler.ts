import { resolvedPromise } from '@vue/shared'

let isFlushPending = false
let currentFlushPromise: Promise<void> | null = null
const pendingPreFlushCbs: Function[] = []
export function queuePreFlushCb(cb: Function) {
    queueCb(cb, pendingPreFlushCbs)
}
function queueCb(cb: Function, pendingQueue: Function[]) {
    pendingQueue.push(cb)
    queuePreFlush()
}
function queuePreFlush() {
    if (!isFlushPending) {
        isFlushPending = true
        currentFlushPromise = resolvedPromise.then(flushJobs)
    }
}
function flushJobs() {
    isFlushPending = false
    flushPreFlushCbs()
}
export function flushPreFlushCbs() {
    if (pendingPreFlushCbs.length) {
        let activePreFlush = [...new Set(pendingPreFlushCbs)]
        pendingPreFlushCbs.length = 0
        for (let i = 0; i < activePreFlush.length; i++) {
            activePreFlush[i]()
        }
    }
}
