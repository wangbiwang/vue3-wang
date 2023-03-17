import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { Fragment, isSameVNodeType } from './vnode'
import { EMPTY_OBJ } from '@vue/shared'

export interface RenderOptions {
    /**
     * 为指定的 element 的 props 打补丁
     */
    patchProp(el: Element, key: string, prevVlaue: any, nextValue: any): void
    /**
     * 为 Element 设置 Ftext
     */
    setElementText(node: Element, text: string): void
    /**
     * 插入指定的el 到parent 中，anchor表示插入位置
     */
    insert(el, parent: Element, anchor?): void
    /**
     * 创建 element
     */
    createElement(type: string)

    remove(el: Element)

    createText(text: string)

    setText(node, text)
}
export function createRender(options: RenderOptions) {
    return baseCreateRenderer(options)
}

function baseCreateRenderer(options: RenderOptions) {
    const {
        insert: hostInsert,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        setElementText: hostSetElementText,
        remove: hostRemove,
        createText: hostCreateText,
        setText: hostSetText,
    } = options
    const processText = (oldVNode, newVNode, container, anchor) => {
        if (oldVNode == null) {
            //挂载操作
            newVNode.el = hostCreateText(newVNode.children)
            hostInsert(newVNode.el, container, anchor)
        } else {
            //更新操作
            const el = (newVNode.el = oldVNode.el)
            if (newVNode.children !== oldVNode.children) {
                hostSetText(el, newVNode.children)
            }
        }
    }
    const processElement = (oldVNode, newVNode, container, anchor) => {
        if (oldVNode == null) {
            //挂载操作
            mountElement(newVNode, container, anchor)
        } else {
            //更新操作
            patchElement(oldVNode, newVNode)
        }
    }
    const mountElement = (vnode, container, anchor) => {
        const { type, props, shapeFlag } = vnode
        //1.创建 element
        const el = (vnode.el = hostCreateElement(type))
        //2.设置文本
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, vnode.children as string)
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        }
        //3.设置props
        if (props) {
            for (const key in props) {
                hostPatchProp(el, key, null, props[key])
            }
        }
        //4.插入
        hostInsert(el, container, anchor)
    }
    const patchElement = (oldVNode, newVNode) => {
        const el = (newVNode.el = oldVNode.el)
        const oldProps = oldVNode.props || {}
        const newProps = newVNode.props || {}
        patchChildren(oldVNode, newVNode, el, null)
        patchProps(el, newVNode, oldProps, newProps)
    }
    const patchChildren = (oldVNode, newVNode, container, anchor) => {
        const c1 = oldVNode && oldVNode.children
        const prevShapeFlag = oldVNode ? oldVNode.shapeFlag : 0
        const c2 = newVNode && newVNode.children
        const { shapeFlag } = newVNode
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            //新节点是TEXT

            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                //旧节点是ARRAY
                //卸载旧节点
            }
            if (c1 !== c2) {
                //不是ARRAY，且新旧children不一致
                //挂载新子节点的文本
                hostSetElementText(container, c2)
            }
        } else {
            //新节点不是TEXT
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                //旧节点是ARRAY
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    //如果新节点也是ARRAY
                    //要进行diff运行
                } else {
                    //则进行卸载操作
                }
            } else {
                //旧节点不是ARRAY
                if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                    //如果旧节点是TEXT
                    //删除旧节点的text
                    hostSetElementText(container, '')
                }
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    //新节点是ARRAY
                    //单独新子节点的挂载操作
                }
            }
        }
    }
    const patchProps = (el, newVNode, oldProps, newProps) => {
        if (oldProps !== newProps) {
            //新增新的props
            for (const key in newProps) {
                const next = newProps[key]
                const prev = oldProps[key]
                if (next !== prev) {
                    hostPatchProp(el, key, prev, next)
                }
            }
        }
        if (oldProps !== EMPTY_OBJ) {
            //删除旧prop的key不在新prop中
            for (const key in oldProps) {
                if (!(key in newProps)) {
                    hostPatchProp(el, key, oldProps[key], null)
                }
            }
        }
    }
    const patch = (oldVNode, newVNode, container, anchor = null) => {
        if (oldVNode === newVNode) return
        if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
            //不是同一个元素，删除旧节点
            unmount(oldVNode)
            oldVNode = null
        }
        const { type, shapeFlag } = newVNode
        switch (type) {
            case Text:
                processText(oldVNode, newVNode, container, anchor)
                break
            case Comment:
                break
            case Fragment:
                break
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(oldVNode, newVNode, container, anchor)
                } else if (shapeFlag & ShapeFlags.COMPONENT) {
                }
        }
    }
    const unmount = (vnode) => {
        hostRemove(vnode.el)
    }
    const render = (vnode, container) => {
        if (vnode === null) {
            //卸载操作
            if (container._vnode) {
                unmount(container._vnode)
            }
        } else {
            //打补丁操作
            patch(container._vnode ? container._vnode : null, vnode, container)
        }
        container._vnode = vnode
    }
    return { render }
}
