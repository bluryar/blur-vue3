import type { Ref, Slots, VNode } from 'vue';

/** slot转VNode */
export const genSlotVNodes = (slots: Slots) =>
  Object.keys(slots)
    .map((k) => slots[k]?.())
    .filter(Boolean) as unknown as VNode[];

/**
 * 生成工厂函数，通常用于`h(Comp,{},genSlotVNodesFactory(this.$slots))`
 */
export const genSlotVNodesFactory = (slots: Slots) => () => genSlotVNodes(slots);

/** 生成一个用于h函数第二个参数的双向绑定对象 `h(comp, {...getVModelRecord(foo)})` */
export const getVModelRecord = <T = any>(source: Ref<T>, vModelKey = 'value') => {
  return {
    [vModelKey]: source.value,
    [`onUpdate:${vModelKey}`]: (val: T) => {
      source.value = val;
    },
  };
};
