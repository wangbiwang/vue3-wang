export const isArray = Array.isArray
export const isObjeact = (val: unknown) => val !== null && typeof val === 'object'

/**
 * 对比数据是否发生变化
 */
export const hasChanged = (value: unknown, oldValue: unknown): boolean => !Object.is(value, oldValue)

export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'

export const extend = Object.assign
export const resolvedPromise = Promise.resolve()

export const isOn = (key: string) => {
    const onRe = /^on[^a-z]/
    return onRe.test(key)
}

/**
 * 只读的空对象
 */
export const EMPTY_OBJ: { readonly [key: string]: any } = {}