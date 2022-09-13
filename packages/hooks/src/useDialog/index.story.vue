<!-- 交互式文档 -- 使用 `<Story>` 和 `<Variant>` 组件来写交互 -->
<script lang="tsx" setup>
import { Button } from '@arco-design/web-vue';
import { ref, defineAsyncComponent } from 'vue';
import '@arco-design/web-vue/dist/arco.css';

import { getVModelRecord } from '@bluryar/shared';
import { useDialog } from '.';

const count1 = ref(0);
const count2 = ref(0);
const count3 = ref(0);

const vModel3 = () => getVModelRecord(count3, 'count');

const { Dialog: Dialog1, openDialog: openDialog1 } = useDialog(defineAsyncComponent(() => import('./demo/dialog.vue')));
const { Dialog: Dialog2, openDialog: openDialog2 } = useDialog(
  defineAsyncComponent(() => import('./demo/dialog.vue')),
  () => getVModelRecord(count2, 'count'),
);
const { Dialog: Dialog3, openDialog: openDialog3 } = useDialog(defineAsyncComponent(() => import('./demo/dialog.vue')));
</script>

<template>
  <Story
    id="examples_template_src_hooks_useUmDialog_index_story_vue"
    title="useDialog"
    icon="fluent-emoji:hammer-and-wrench"
    :layout="{ type: 'grid', width: '300px' }"
  >
    <Variant title="通过`v-model`传递双向绑定参数">
      <Button type="primary" status="warning" @click="() => openDialog1()">
        <Dialog1 v-model:count="count1"></Dialog1>
        打开弹窗1 {{ count1 }}
      </Button>
    </Variant>

    <Variant title="通过`hooks`传递双向绑定参数">
      <Button type="primary" status="warning" @click="() => openDialog2()">
        <Dialog2></Dialog2>
        打开弹窗2 {{ count2 }}
      </Button>
    </Variant>

    <Variant title="通过`openDialog的参数`传递双向绑定参数">
      <Button type="primary" status="warning" @click="() => openDialog3(vModel3)">
        <Dialog3></Dialog3>
        打开弹窗3 {{ count3 }}

        <template #controls>
          <div class="arco-text-caption">
            这里通过openDialog来传递参数，但是，由于useUmDialog中没有传递默认参数，而弹窗将`count`声明为必填选项，因此控制台会报一个告警
          </div>
        </template>
      </Button>
    </Variant>
  </Story>
</template>

<docs lang="md" src="./index.md"></docs>
