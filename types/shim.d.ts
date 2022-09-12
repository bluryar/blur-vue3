/// <reference types="@histoire/plugin-vue/components" />

import type { AttributifyAttributes } from '@unocss/preset-attributify';

declare module '@vue/runtime-core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HTMLAttributes extends AttributifyAttributes {}
}

export {};
