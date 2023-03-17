import { extend } from '@vue/shared'
import { createRender } from 'packages/runtime-core/src/render'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

let renderer
let rendererOptions = extend({ patchProp }, nodeOps)
function ensureRenderer() {
    return renderer || (renderer = createRender(rendererOptions))
}
export const render = (...args) => {
    ensureRenderer().render(...args)
}
