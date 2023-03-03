import { isObjeact } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'
/**
 * 响应性Map缓存
 * key：target obj
 * val：proxy  obj
 */
export const reactiveMap = new WeakMap<object, any>()
export function reactive(target: object) {
    return creactReactiveObject(target, mutableHandlers, reactiveMap)
}
function creactReactiveObject(target: object, baseHandlers: ProxyHandler<any>, ProxyMap: WeakMap<object, any>) {
    const existinProxy = ProxyMap.get(target)
    if (existinProxy) {
        return existinProxy
    }
    const proxy = new Proxy(target, baseHandlers)
    ProxyMap.set(target, proxy)
    return proxy
}
export const toReactive = <T extends unknown>(value: T): T => {
    return isObjeact(value) ? reactive(value as object) : value
}
