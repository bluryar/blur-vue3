# Hooks - 自定义的组合式函数

> const { data, run } = UseHook(...args, { manual: true })

- 当前文件夹存放项目自己的通用组合式API
- 在 `src/hooks`文件下任意目录添加 `useXxx.story.vue`文件，即可添加hooks的文档，键入： `vue-doc-dynamic` 回车， 然后选择图标： fluent-emoji:hammer-and-wrench，具体参考 [Histoire](https://histoire.dev/examples/vue3/controlled-stories.html#single-control)
- 项目已经配置好了 `VsCode Snippets`, 新建文件，然后键盘键入 `vue-hooks`，vscode 会提示代码块，回车即可，自动根据文件名填充函数名。

## 前置知识

> 副作用(effect)函数的含义是:  副作用函数的执行会直接或间接的影响其他函数的执行, 这时, 可以说该函数的执行产生的副作用.
> 
> 与之相对的概念应该是: 纯函数, 比如 `const add = (a, b) => a + b`

vue的**响应式系统**就是通过收集副作用, 然后在合适的时刻将收集到的副作用重新执行. 

> 比如在任意作用域中修改：`document.documentElement.style.foo = 1`, `document`是宿主环境提供的，任意层级的函数作用域都可以访问。

据我目前有限的了解, 我们代码里边会收集副作用的情况有:

1. `computed` 中读取了 `Ref`或者 `Reactive`
2. `watch` 中, 传递给第一个参数的Ref或者函数进行了读取响应式数据时. `watch(_ref, () => {})` 或 `watch(() => _ref.value, () => {})`
3. `watchEffect`

```ts
const val = ref(0)
const res = ref(0)
watchEffect(() => {
  // 读取val的value属性将把整个匿名函数收集起来作为副作用
  res.value = val.value
})

tryOnMounted(()=>{
  setTimeout(() => {
    // 修改ref的值, 将触发上面的副作用函数的执行. 即watchEffect内的整个匿名函数会整个重新执行将
    val.value = val.value + 1
  }, 500);
})

```

4. `render` 函数, 或者 `<template>`模板内的内容
   内部应该（乱写的，没去了解）是用一个封装后的ReactiveEffect去收集响应式依赖：

```ts
watchEffect(()=>{
  // renderer应该是在`main.ts`调用`createApp`时设置好的
  // render函数就是我们组件写的JSX\模板
  renderer.render(vnode, document.querySelector('#app'))
})
```

## 封装约定

Anthony Fu (vueuse的作者, vite和vue的core team member) 有过一个演讲, 里边的组合式API思想是他编写了大量 `vueuse`函数后总结的.

- 相关连接: [可组合的 Vue - VueConf China 2021](https://antfu.me/posts/composable-vue-vueconf-china-2021)

---

1. 具体命名请见上面
2. 编码风格具体请查看 `vueuse`的[最佳实践](https://vueuse.org/guide/best-practice.html#best-practice)章节以及[指引](https://vueuse.org/guidelines.html#guidelines)章节.

---

这里简略介绍一下思路:

1. 函数接收的参数 *多为* `Ref` 类型, 如果允许传入非 `Ref<T>`的参数, 则建议将参数类型定义为 `MaybeRef<T>`. (原因看第 4 点)

```ts
type MaybeRef<T> = Ref<T> | T

export function useDemo(params: MaybeRef<number>) {
  // ...
  return {
    val: ref(params)
  }
}
```

2. 函数 *应该* 返回一个对象. 这样函数的返回值可以解构：

```ts
const { val } = useDemo(1)
// const {val} = useDemo(ref(1))

console.log(val.value)
```

3. 尽量使用选项对象作为参数

```ts
type MaybeRef<T> = Ref<T> | T

export interface Options {
  demo?: MaybeRef<string>
}

export function useDemo(params: MaybeRef<number>, options: Options) {
  // ...
  return {
    val: ref(params)
  }
}
```

4. 灵活使用 `unref`和 `ref`

```ts
type MaybeRef<T> = Ref<T> | T

export interface Options {
  demo?: MaybeRef<string>
}

export function useDemo(params: MaybeRef<number>, options: Options) {
  // 1. 假如params不是一个Ref, 那么这里将创建一个新的Ref
  // 2. 假如params是一个Ref, 那么再次将其赋予Ref, 并不会新创建一个副作用, 而回复用原来的Ref, 即: 将ref原路返回.
  const val = ref(params) 

  // 1. unref会在内部通过`isRef`方法判断传入变量是不是`Ref`, 如果是, 就会将他的value取下来, 相当于`const rawValue = params.value`
  // 2. 如果params就是js的变量类型, 那么就原路返回, 相当于 `const rawValue = params`
  const rawValue = unref(params)

  return {
    val,
    rawValue
  }
}
```

5. 时刻谨记销毁副作用
   比如地图的绘制, 要记得在组件卸载时销毁相关的上下文

```ts
const map = new BMapGL.Map('id')

tryOnUnMounted(() => {
  map.destory()
})
```

6. 对于大量数据, 比如接口返回的, 使用 `shallowRef` 包裹.
   `ref`默认是递归建立副作用映射表的.

### 一些技巧

1. 函数的options对象考虑是否提供 `immediate`参数或者 `manual`(核心方法是否在使用该hook的时候立即执行, 还是允许用户通过一个函数手动执行)

   ```ts
   const { run } = useDemo(..., { manual: true })

   setTimeout(() => {
     run()
   }, 500);
   ```
2. 需要双向绑定(v-model)时, 使用 `@vueuse/core`的 `useVModel`方法

   比如你需要二次封装一个表单组件, 那么可以这样:

   ```ts
   const props = defineProps<{
     value: string
   }>()
   const emit = defineEmits(["update:value"])
   const value = useVModel(props, 'value', emit)

   const onClick = () => {
     // 会自动触发`emit('update:value', 'xxxxxxxx')`
     value.value = 'xxxxxxxx'
   }
   ```
   又比如二次封装一个弹窗组件时:

   ```html
   <script setup>
   const props = defineProps<{
     visible: string
   }>()
   const emit = defineEmits(["update:visible"])
   const visible = useVModel(props, 'visible', emit)

   // 通常你需要在弹窗打开或关闭时进行某些操作
   watch(visible, (val) => {
     if (val) {
       // TODO
     } else {
       // TODO
     }
   })
   </script>

   <template>
     <Modal v-model:visible="visible">
       <!-- TODO -->
     </Modal>
   </template>
   ```
   - 当然, 这样二次封装受到了 `element-ui`的 `<ElDialog />`影响.
   - 使用某些方法, 然后使用 `useModal(<MyDialog></MyDialog>)`这样似乎更好?
     - **UPDATE**: 已经实现了一个初步版本： `useDialog`
3. vueuse 在很后面的版本(v8.x.x以后)新增了一个工具类型：`MaybeComputedRef`, 以及相对于的函数 `resolveUnref`，是上面的 `MaybeRef`和 `unref`的增强版。 **更推荐推荐使用类型以及方法去处理参数**。

   resolveUnRef的 *实现* ：

   ```ts
   /**
    * Normalize value/ref/getter to `ref` or `computed`.
   */
   export function resolveUnref<T>(r: MaybeComputedRef<T>): T {
     return typeof r === 'function'
       ? (r as any)()
       : unref(r)
   }
   ```
   MaybeComputedRef的 *定义* :

   ```ts
   export type MaybeRef<T> = T | Ref<T>;

   export type MaybeReadonlyRef<T> = (() => T) | ComputedRef<T>;

   export type MaybeComputedRef<T> = MaybeReadonlyRef<T> | MaybeRef<T>
   ```
   > 他们的使用方法可以参考 useDialog
   >

   
   ***为什么需要这个类型***


   某些情况下，我们的hooks期望用户传入的内容是响应式的：

   ```ts
   const useMyHooks = (options: { detail: Ref<any> } ) => {
     // TODO
   }
   ```
   但是，用户在使用的时候，如果传递的是某个对象的某个状态（尽管是ref），会造成响应式丢失，因为setup钩子不会收集副作用。 eg:

   ```html
   <script lang="ts" setup>
   const props = defineProps<{
     parentState: {
       detail: any
       other: any
     }
   }>()

   // ! 这里直接传递会造成响应式的丢失，因为直接在setup中对对象进行get，不会收集effect
   useMyHooks({ detail: props.parentState.detail })

   </script>
   ```
   为了解决这种情况，请将参数定义成MaybeComputedRef:

   ```ts
   import { MaybeComputedRef, resolveUnref } from '@vueuse/core'
   const useMyHooks = (options: { detail: MaybeComputedRef<any> } ) => {
     // * 新增
     const innerState = computed(() => resolveUnref(options.detail))
   }
   ```
   然后使用函数或者computed传递参数：

   ```html
   <script lang="ts" setup>
   const props = defineProps<{
     parentState: {
       detail: any
       other: any
     }
   }>()

   // ! 这样，就可以保证响应式的存在，因为对于`props.parentState`以及`props`的get操作发生在useMyHooks内部，这里的响应式就有这个hooks的作者去处理了。
   useMyHooks({ detail: () => props.parentState.detail })

   // 或者
   const detail = computed(() => props.parentState.detail)
   useMyHooks({ detail })
   ```
