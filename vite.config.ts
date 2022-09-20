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
      // 配置别名，不再使用`@`表示`src`，在这里配置的别名，请务必去`tsconfig.json`配置，按图索骥增加配置即可。
      alias: {
        '~': pathResolve('./src'),
        '@bluryar/shared': pathResolve('./packages/shared/src'),
        '@bluryar/hooks': pathResolve('./packages/hooks/src'),
        '@bluryar/components': pathResolve('./packages/components/src'),
        '@bluryar/unocss-presets': pathResolve('./packages/unocss-presets/src'),
      },
    },

    // 配置less和sass相关配置，按照经验，对于不在意打包体积的项目，如果要配置modifyVar，通过在main.ts中引入对于的样式文件，在样式文件中修改似乎更好。
    css: {},

    optimizeDeps: {
      include: ['@histoire/plugin-vue', 'pinia-plugin-persistedstate', 'dayjs', 'dayjs/locale/zh-cn'],
      exclude: [
        // 有关现代库打包知识看这篇文章： https://github.com/frehner/modern-guide-to-packaging-js-library/blob/main/README-zh_CN.md
        // 如果已经第三方依赖提供了esm的导出， 则将其排除 --------- 一个简单且不准确的经验：通过看这个库的`package.json`是否包含是否有关键字`module`。
        'lodash-es',
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/components',
        '@vueuse/core',
        '@vueuse/head',
        '@vueuse/integrations',
        '@vueuse/math',
        '@vueuse/router',
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
