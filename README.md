# vue3-wang

学习 vue3 源码，实现精简版的 vue3

## 命令式、声明式、运行时、编译时概念

### 命令式编程（类似于 jsx）：关注过程,详细描述步骤和逻辑。

### 声明式编程（类似于 template）：关注结果，不关注具体的实现步骤和逻辑。（不关注，不代表不存在，声明式的框架本质上是由命令式的代码实现的！）

### 1、性能方面：命令式 >= 声明式

### 2、可维护性：命令式 <= 声明式

### 3、vue 框架的本质，就是用命令式的的代码封装功能，再对外暴露声明式的使用接口。

### 4、框架的设计就是在可维护性和性能之间进行取舍平衡。

### 编译时: compiler

### 运行时：runtime

### vue 通过 compiler 解析 html 模板，然后通过 runtime 解析 render，从而挂载真实 dom。

### ### 为什么 vue 是运行时+编译时的框架？

### 1、纯运行时(react 的 jsx，直接 render 函数渲染)：不需要 html 模板，也就不用 compiler 编译模板生成 js 对象，所以只需要一个描述 html 的复杂 js 对象。

### 2、纯编译时(svelte,直接编译模板生成 html 代码渲染，不需要 render 函数)：没有运行时，分析差异操作放到编译时进行,速度更快，但是损失灵活性，且不能跨端。

### 3、运行时+编译时(vue,template 模板由 compiler 编译成对象，然后利用运行时（render），通过对象挂载到 DOM 上)：保持灵活性的基础上，尽量优化性能，达到平衡。

### 4、运行时编译时差异，运行时有 Vnode。

### 响应性

### Object.defineProperty 局限性：只能监听指定对象指定属性的响应性，新增的属性监听不到。

```js
const product = { price: 10, quantity: 2 }
let total = product.price * product.quantity
Object.defineProperty(product, 'quantity', {
    get() {
        return quantity
    },
    set(newVal) {
        quantity = newVal
    },
})
```

### proxy :用于创建对象代理，代理对象中任何属性都可以触发 handler 的 getter 和 setter，所以在新增属性时，不会失去响应性的问题。
### Reflect：通常配合 proxy 使用，Reflect.get(target,propertyKey[,receiver])

```js
const product = { price: 10, quantity: 2 }
const p = new Proxy(product, {
    get(target, key, receiver) {
        // return target[key] 在代理对象中有某些this调用时，会出现代理对象中方法触发失效问题。所以需要配合Reflect
        Reflect.get(target, key, receiver)
    },
    set(target, key, newVal, receiver) {
        target[key] = newVal
        return true
    },
})
let total = product.price * product.quantity
```
### weakMap和Map区别？
#### WeakMap只接受对象作为键，而Map可以接受任意类型的值作为键。
#### WeakMap的键是弱引用，也就是说，如果没有其他变量引用该对象，那么垃圾回收机制就会回收该对象并释放内存。而Map的键则是强引用，即使没有其他变量引用该对象，垃圾回收机制也不会回收该对象。
#### 这两点区别决定了WeakMap和Map的使用场景也不同。WeakMap适合用于存储一些临时的、不常用的数据，例如DOM元素、事件监听器等。而Map适合用于存储一些持久的、常用的数据，例如用户信息、商品列表等。

