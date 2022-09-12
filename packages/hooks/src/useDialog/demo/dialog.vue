<script lang="ts" setup>
import { defineComponent } from 'vue';
import { useVModel } from '@vueuse/core';
import { Button, Modal } from '@arco-design/web-vue';

const props = defineProps<{
  visible: boolean;
  count: number;
  modalProps?: GetComponentPropsType<typeof Modal>;
}>();
defineEmits(['update:visible', 'update:count']);

const visible = useVModel(props, 'visible');
const count = useVModel(props, 'count');
</script>

<script lang="ts">
export default defineComponent({
  name: 'DemoDialog',
});
</script>

<template>
  <Modal v-model:visible="visible" v-bind="modalProps">
    {{ count }}
    <Button type="primary" @click="count += 1">点我+1</Button>
  </Modal>
</template>

<style lang="scss" scoped>
//
</style>
