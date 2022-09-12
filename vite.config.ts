/// <reference types="vite/client" />

import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { setupVitePlugin, pathResolve } from './vite.plugins';

export default defineConfig(async ({ command, mode }) => {
  /** @see ./build/vite */
  const plugins = await setupVitePlugin({
    src: pathResolve('./src'),
  });

  const customViteConfig: UserConfig = {
    resolve: {
      alias: {
        '~': pathResolve('./src'),
        '@bluryar/shared': pathResolve('./packages/shared/src'),
        '@bluryar/hooks': pathResolve('./packages/hooks/src'),
        '@bluryar/components': pathResolve('./packages/components/src'),
        '@bluryar/unocss-presets': pathResolve('./packages/unocss-presets/src'),
      },
    },

    css: {},

    optimizeDeps: {
      include: [
        '@histoire/plugin-vue',
        'pinia-plugin-persistedstate',
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/components',
        '@vueuse/core',
        '@vueuse/head',
        '@vueuse/integrations',
        '@vueuse/math',
        '@vueuse/router',
        'dayjs',
        'dayjs/locale/zh-cn',
        'lodash-es',
        'vue-request',
      ],
    },

    server: {
      host: '0.0.0.0',
    },

    build: {
      target: 'es2015',
    },

    plugins,
  };

  return customViteConfig;
});
