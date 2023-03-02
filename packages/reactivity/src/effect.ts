import { isArray } from '@vue/shared'
import { Dep, cerateDep } from './dep'

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
    constructor(public fn: () => T) {}
    run() {
        activeEffect = this
        return this.fn()
    }
}
export function effect<T = any>(fn: () => T) {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}
type keyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<object, keyToDepMap>()

/**
 * 收集依赖
 */
export function track(target: object, key: unknown) {
    console.log('收集依赖')
    if (!activeEffect) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = cerateDep()))
    }
    trackEffect(dep)
    // depsMap.set(key, activeEffect)
    // console.log(targetMap)
}
/**
 * 利用dep 依次跟踪key的所有effect
 */
export function trackEffect(dep: Dep) {
    dep.add(activeEffect!)
}

/**
 * 触发依赖
 */
export function trigger(target: object, key: unknown, value: unknown) {
    console.log('触发依赖')
    let depsMap = targetMap.get(target)
    if (!depsMap) return
    let dep: Dep | undefined = depsMap.get(key)
    if (!dep) return
    triggerEffects(dep)
    // if (!effect) return
    // effect.run()
}
/**
 * 依此触发dep中保存的依赖
 */
export function triggerEffects(dep: Dep) {
    const effects = isArray(dep) ? dep : [...dep]
    for (const effect of effects) {
        effect.run()
    }
}
