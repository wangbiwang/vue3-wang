import { extend, isArray } from '@vue/shared'
import { Dep, cerateDep } from './dep'
import { ComputedRefImpl } from './computed'

export let activeEffect: ReactiveEffect | undefined
type EffectScheduler = (...args: any[]) => any
export class ReactiveEffect<T = any> {
    computed?: ComputedRefImpl<T>
    constructor(public fn: () => T, public scheduler: EffectScheduler | null = null) {}
    run() {
        activeEffect = this
        return this.fn()
    }
    stop(){
        
    }
}
export interface ReactiveEffectOPtions {
    lazy?: boolean
    scheduler?: EffectScheduler
}
export function effect<T = any>(fn: () => T, option?: ReactiveEffectOPtions) {
    const _effect = new ReactiveEffect(fn)
    if (option) {
        //合并option中的调度器
        extend(_effect, option)
    }
    if (!option || !option.lazy) {
        _effect.run()
    }
}
type keyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<object, keyToDepMap>()

/**
 * 收集依赖
 */
export function track(target: object, key: unknown) {
    // console.log('收集依赖')
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
    trackEffects(dep)
    // depsMap.set(key, activeEffect)
    // console.log(targetMap)
}
/**
 * 利用dep 依次跟踪key的所有effect
 */
export function trackEffects(dep: Dep) {
    dep.add(activeEffect!)
}

/**
 * 触发依赖
 */
export function trigger(target: object, key: unknown, value: unknown) {
    // console.log('触发依赖')
    let depsMap = targetMap.get(target)
    if (!depsMap) return
    let dep: Dep | undefined = depsMap.get(key)
    if (!dep) return
    triggerEffects(dep)
    // if (!effect) return
    // effect.run()
}
/**
 * 依次触发dep中保存的依赖
 */
export function triggerEffects(dep: Dep) {
    const effects = isArray(dep) ? dep : [...dep]
    for (const effect of effects) {
        if (effect.computed) {
            triggerEffect(effect)
        }
    }
    for (const effect of effects) {
        if (!effect.computed) {
            triggerEffect(effect)
        }
    }
}
export function triggerEffect(effect: ReactiveEffect) {
    if (effect.scheduler) {
        effect.scheduler()
    } else {
        effect.run()
    }
}
