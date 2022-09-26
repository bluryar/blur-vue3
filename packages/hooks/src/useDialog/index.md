# useDialog

[[toc]]

适配对 `<AModal> 二次封装的弹窗的简易hook。`

::: info
123
:::

```
测试
```


## 背景

  以往封装弹窗一般是连同Modal一起封装的，因此 `Modal.xxx` 方法一般用不了，由此，我们需要通过在容器组件中定义一个 `visible` 变量，在使用 `v-model` 语法绑定，对于某些表格或者卡片列表，如果业务是打开详情弹窗，那么还需要绑定id或者整个vo。

  为了减少我在写业务时的重复劳动，就写下了这么个方法。

## 使用方法

1. 通过 `defineAsyncComponent` API引入组件，传递给 `useDialog` 的第一个参数。
2. 将弹窗的props传给useDialog的第二个参数（推荐使用箭头函数返回对象的形式，以此保持响应式）
3. 通过 `openDialog`方法打开弹窗

  具体内容查看 `./index.ts`即可，方法内部处理的东西很少。

> 需要注意的是：使用这种方式由三个地方可以传入组件的props，返回的组件是函数式组件，是可以进行双向绑定的：`<Dialog v-model:foo="foo"/>`

## 封装弹窗的一种方式

一般我安装这个模板封装弹窗：

```html{5}
<script lang="ts" setup>
import type { Modal } from '@arco-design/web-vue';
import { useVModel } from '@vueuse/core';

const props = defineProps<{
  visible: boolean;
  detail: string[];
  modalProps?: GetComponentPropsType<typeof Modal>;
}>();

const visible = useVModel(props, 'visible')
const item = computed(() => props.detail?.[0] || 'hello world')

</script>

<script lang="ts">
export default defineComponent({
  name: 'MyDialog',
})
</script>

<template>
  <AModal v-model:visible="visible" v-bind="modalProps">
    {{ item }}
  </AModal>
</template>

<style lang="scss" scoped>

</style>
```

那么在使用这个 `<MyDialog>`时，就可以用这种方式:

```html
<script lang="ts" setup>
const { Dialog, openDialog } = useDialog(
  defineAsyncComponent(() => import('./MyDialog.vue')),
  () => ({
    detail: ['yes']
  })
)
</script>

<script lang="ts">
export default defineComponent({
  name: 'README',
})
</script>

<template>
  <div>
    <Dialog />
    <button @click="openDialog({detail: ['no']})">点我</button>
  </div>
</template>

<style lang="scss" scoped>

</style>

```
