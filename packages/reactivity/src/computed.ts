import { isFunction } from '@vue/shared'
import { Dep } from './dep'
import { ReactiveEffect, track } from './effect'
import { trackRefValue, triggerRefValue } from './ref'
export class ComputedRefImpl<T> {
    public dep?: Dep = undefined
    private _value!: T
    public readonly effect: ReactiveEffect<T>
    public readonly __v_isRef = true
    public _dirty = true
    constructor(getter) {
        this.effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true
                triggerRefValue(this)
            }
        })
        this.effect.computed = this
    }
    get value() {
        trackRefValue(this)
        if (this._dirty) {
            this._dirty = false
            this._value = this.effect.run()
        }

        return this._value
    }
}

export function computed(gettterOrOption) {
    let getter
    const onlyGetter = isFunction(gettterOrOption)
    if (onlyGetter) {
        getter = gettterOrOption
    }
    const cRef = new ComputedRefImpl(getter)
    return cRef
}
