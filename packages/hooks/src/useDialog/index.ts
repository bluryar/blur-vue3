import type { MaybeComputedRef } from '@vueuse/core';
import { resolveUnref, tryOnBeforeUnmount } from '@vueuse/core';
import type { ComputedRef, DeepReadonly, DefineComponent, FunctionalComponent, Ref } from 'vue';
import { computed, defineComponent, h, readonly, ref, shallowRef, unref, watch } from 'vue';
import { getVModelRecord, NOOP } from '@bluryar/shared';

export type DialogProps<Component extends object> = GetComponentPropsType<Component>;
export type DialogFuncComponent<Component extends object> = FunctionalComponent<DialogProps<Component>>;
export type DialogComponent<Component extends object> = DefineComponent<DialogProps<Component>, {}, {}>;

type WrapperType = 'func' | 'object';

export interface UseDialogOptions<T extends object> {
  /**
   * 弹窗组件被哪一种形式包裹父组件包裹, 不是极端的性能追求不要使用func。
   *
   * - `func`: FunctionalComponent
   *
   * - `object`: DefineComponent
   *
   * @default "object"
   * */
  wrapperType?: WrapperType;

  onBeforeOpen?: (state: DeepReadonly<Partial<DialogProps<T>>>) => void;
  onAfterOpen?: (state: DeepReadonly<Partial<DialogProps<T>>>) => void;
  onBeforeClose?: (state: DeepReadonly<Partial<DialogProps<T>>>) => void;
  onAfterClose?: (state: DeepReadonly<Partial<DialogProps<T>>>) => void;
}
export interface UseDialogReturn<T extends object, TT extends WrapperType> {
  /** 弹窗组件, 请将这个组件挂载到<template>里边 */
  Dialog: TT extends 'func' ? DialogFuncComponent<T> : TT extends 'object' | undefined ? DialogComponent<T> : never;
  /** 控制弹窗显示隐藏 */
  visible: Ref<boolean>;
  /** 打开弹窗，在这里传入需要动态获取的属性 */
  openDialog: (props?: MaybeComputedRef<Partial<DialogProps<T>>>) => void;
  /** 关闭弹窗 */
  closeDialog: () => void;
  /** 传递给弹窗的所有状态 */
  state: ComputedRef<Partial<DialogProps<T>>>;
}

/**
 * 弹窗hook，简单的函数式组件，推荐搭配`defineAsyncComponent`使用。
 *
 * @example
 * ```html
 *
 * <script lang="ts" setup>
 * const { Dialog, openDialog, destory } = openDialog(
 *   defineAsyncComponent(() => import('path/to/your/bussinessDialogComponent')),
 *   () => ({
 *     // 看情况赋予默认值
 *     someVO: {}
 *   })
 * )
 * const list = computed(() => ([]))
 * </script>
 *
 * <template>
 *   <div>
 *     <!-- ... -->
 *     <!-- 假设dialog由按钮点击事件触发 -->
 *     <div v-for="vo,idx in list" :key="`${vo?.id}#${idx}`">
 *       <button v-on:click="openDialog({someVO: vo})"></button>
 *     </div>
 *   </div>
 * </template>
 *
 * ```
 */
export const useDialog = <T extends object>(
  comp: T,
  hookProps?: MaybeComputedRef<Partial<DialogProps<T>>>,
  { onBeforeOpen, onAfterOpen, onBeforeClose, onAfterClose, wrapperType }: UseDialogOptions<T> = {
    wrapperType: 'object',
    onBeforeOpen: NOOP,
    onAfterOpen: NOOP,
    onBeforeClose: NOOP,
    onAfterClose: NOOP,
  },
): UseDialogReturn<T, NonNullable<UseDialogOptions<T>['wrapperType']>> => {
  const visible = ref(!!0);
  let methodProps = shallowRef<Partial<DialogProps<T>>>({});
  let compProps = shallowRef<Partial<DialogProps<T>>>({});

  const resolve = (): DialogProps<T> => ({
    ...getVModelRecord(visible, 'visible'),
    ...resolveUnref(hookProps ?? {}),
    ...resolveUnref(unref(compProps)),
    ...resolveUnref(unref(methodProps)),
  });
  let sharedProps = computed(resolve);

  const openDialog = (props?: MaybeComputedRef<Partial<DialogProps<T>>>) => {
    methodProps.value = props ?? {};
    visible.value = !!1;
  };

  const closeDialog = () => {
    visible.value = !!0;
  };

  let DialogWrapper: DialogFuncComponent<T> | DialogComponent<T>;

  if (wrapperType === 'func') {
    DialogWrapper = (innerProps, { slots }) => {
      compProps.value = Object.assign(unref(compProps), innerProps);
      return h(comp, unref(sharedProps), slots);
    };
    DialogWrapper.displayName = 'DialogWrapper';
  } else {
    DialogWrapper = defineComponent((innerProps, { slots }) => {
      compProps.value = Object.assign(unref(compProps), innerProps);
      return () => h(comp, unref(sharedProps), slots);
    });
    DialogWrapper.name = 'DialogWrapper';
  }

  const getState = () => unref(readonly(sharedProps));
  watch(
    visible,
    (val) => {
      const state = getState();
      val ? onBeforeOpen?.(state) : onBeforeClose?.(state);
    },
    { flush: 'pre' },
  );
  watch(
    visible,
    (val) => {
      const state = getState();
      val ? onAfterOpen?.(state) : onAfterClose?.(state);
    },
    { flush: 'post' },
  );

  tryOnBeforeUnmount(() => {
    stop();
    methodProps.value = null;
    compProps.value = null;
  });

  return {
    Dialog: DialogWrapper,
    visible,
    state: sharedProps,
    openDialog,
    closeDialog,
  };
};
