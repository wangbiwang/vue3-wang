export const isArray = Array.isArray
export const isObjeact = (val: unknown) => val !== null && typeof val === 'object'
/**
 * 对比数据是否发生变化
 */
export const hasChanged = (value: unknown, oldValue: unknown): boolean => !Object.is(value, oldValue)
