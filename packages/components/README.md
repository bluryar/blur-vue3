# Components - 项目通用的基础组件

- 当前文件夹存放项目通用的组件
- 在 `src/components`文件下任意目录添加 `Xxx.story.vue`文件，即可添加组件的文档，键入： `vue-doc-dynamic` 回车， 然后选择图标： fluent-emoji:ice，具体参考 [Histoire](https://histoire.dev/examples/vue3/controlled-stories.html#single-control)
- 项目已经配置好了 `VsCode Snippets`，新建文件，然后键盘键入 `vue-comp`，vscode 会提示代码块，回车即可，会自动根据文件名填充组件名。
- 函数式组件伪代码:

```ts
import { FunctionalComponent } from 'vue';
import type { ButtonProps } from 'naive-ui';
type Props = ButtonProps;
interface Emits {}

const Comp: FunctionalComponent<Props, Emits> = (props, { emit }) => {
  return () => h('div');
};

```

- Typescript + h + render 伪代码:

```ts
import type { PropType, ComponentPropsOptions, ExtractPropTypes } from 'vue'
import {Button} from 'naive-ui'

const createProps = ():ComponentPropsOptions => (
  {
    book: {
      // 提供相对 `Object` 更确定的类型
      type: Object as PropType<Book>,
      required: true
    },
    // 也可以标记函数
    callback: Function as PropType<(id: number) => void>
  }
)

// 导出组件的props给使用者。
export type Props = ExtractPropTypes<ReturnType<typeof createProps>>

export default defineComponent({
  name: 'YourComp',
  props: createProps(),
  setup(props) {},
  render(){
    return () => h(Button)
  }
})
```

- [推荐] Typescript + template 伪代码 :

```html
<script lang="ts">
import type { PropType, ExtractPropTypes } from 'vue'

const createProps = () => (
  {
    book: {
      // 提供相对 `Object` 更确定的类型
      type: Object as PropType<Book>,
      required: true
    },
    // 也可以标记函数
    callback: Function as PropType<(id: number) => void>
  }
)

// 导出组件的props给使用者。
export type Props = ExtractPropTypes<ReturnType<typeof createProps>>

export default defineComponent({
  name: 'YourComp',
  props: createProps(),
  setup(props) {},
})
</script>

<template>
  <AModal>
    <!-- TODO -->
  </AModal>
</template>

<style lang="scss" scoped>

</style>

```
