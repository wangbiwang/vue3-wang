import { isArray, isObjeact, isString } from '.'

export function normalizeClass(val: unknown): string {
    let res = ''
    if (isString(val)) {
        res = val
    } else if (isArray(val)) {
        for (let i = 0; i < val.length; i++) {
            const normalized = normalizeClass(val[i])
            if (normalized) {
                res += normalized + ' '
            }
        }
    } else if (isObjeact(val)) {
        for (const name in val as object) {
            if ((val as object)[name]) {
                res += name + ' '
            }
        }
    }
    return res.trim()
}


