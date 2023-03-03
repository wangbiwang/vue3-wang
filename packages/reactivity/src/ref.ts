import { Dep, cerateDep } from './dep'
import { activeEffect, trackEffects } from './effect'
import { toReactive } from './reactive'

export interface Ref<T = any> {
    value: T
}
export function ref(value: unknown) {
    return createRef(value, false)
}
function createRef(rawValue: unknown, shallow: boolean) {
    if (isRef(rawValue)) {
        return rawValue
    }
    return new RefImpl(rawValue, shallow)
}
class RefImpl<T> {
    private _value: T
    public dep?: Dep = undefined
    public readonly __v_isRef = true
    constructor(value: T, public readonly __v_isShallow: boolean) {
        this._value = __v_isShallow ? value : toReactive(value)
    }
    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newVal) {}
}
function trackRefValue(ref) {
    if (activeEffect) {
        trackEffects(ref.dep || (ref.dep = cerateDep()))
    }
}
/**
 * 判断是否位Ref
 */
export function isRef(r: any): r is Ref {
    return !!(r && r.__v_isRef === true) //!!强制转成boolean类型
}
