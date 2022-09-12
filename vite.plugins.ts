import type { PluginOption } from 'vite';
import IconsResolver from 'unplugin-icons/resolver';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { VueUseComponentsResolver, ArcoResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Vue from '@vitejs/plugin-vue';
import VueJSX from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import Icons from 'unplugin-icons/vite';
import Inspect from 'vite-plugin-inspect';
import { iconsOptions } from './unocss.config';
import { fileURLToPath } from 'url';
import path from 'path';

export const pathResolve = (...dirs: string[]): string => {
  const [, dirname] = fileURLToPath(import.meta.url).match(/(.+)\/(.+)\.ts/);
  return path.resolve(dirname, ...dirs);
};

export interface SetupVitePluginOptions {
  /**
   * 源代码根目录
   *
   * @default ""
   */
  src?: string;
}

export const setupVitePlugin = async (options: SetupVitePluginOptions = {}): Promise<PluginOption[]> => {
  const { src = '' } = options;

  /** [必须] vue相关插件 */
  const vueBuiltinPlugins = [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    VueJSX(),
  ];

  /** 样式和图标相关插件 */
  const cssAndIconPlugins = [
    Unocss({}),
    Icons({
      scale: iconsOptions.scale,
      compiler: 'vue3',
      defaultStyle: Object.entries(iconsOptions.extraProperties)
        .map(([k, v]) => `${k}:${v}`)
        .join(';'),
    }),
  ];

  /** [可选] 开发时的辅助插件 */
  const devtimePlugins = [Inspect()];

  /** [必须] 路由相关插件 */
  const routerAndLayoutPlugins = [
    Pages({
      dirs: src + '/views',
      extensions: ['vue'],
      exclude: ['**/components/**'],
      routeStyle: 'nuxt',
    }),
    Layouts({
      layoutsDirs: src + '/layouts',
    }),
  ];

  /** 与自动引入功能相关的插件 */
  const autoImportPlugins = [
    Components({
      dirs: [],
      dts: 'types/auto-components.d.ts',

      resolvers: [
        NaiveUiResolver(),
        ArcoResolver(),
        IconsResolver({
          enabledCollections: [
            'ant-design',
            'carbon',
            'fluent-emoji',
            'fluent-emoji-flat',
            'geo',
            'icon-park-outline',
            'icon-park-solid',
            'vscode-icons',
          ],
        }),
        VueUseComponentsResolver(),
      ],
    }),

    AutoImport({
      dts: 'types/auto-imports.d.ts',
      include: [/\.[jt]sx?$/, /\.vue\??/],
      dirs: [],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'vue-request': ['useRequest'],
        },
        '@vueuse/core',
        '@vueuse/head',
        '@vueuse/math',
        {
          '@vueuse/router': ['useRouteHash', 'useRouteParams', 'useRouteQuery'],
        },
        {
          '@vueuse/integrations': [
            'useAsyncValidator',
            'useAxios',
            'useChangeCase',
            'useCookies',
            'useDrauu',
            'useFocusTrap',
            'useFuse',
            'useJwt',
            'useNProgress',
            'useQRCode',
          ],
        },
      ],
      eslintrc: {
        enabled: !!1,
        filepath: '.eslintrc-auto-import.json',
        globalsPropValue: !!1,
      },
    }),
  ];

  return [
    ...vueBuiltinPlugins.filter(Boolean),
    ...cssAndIconPlugins.filter(Boolean),
    ...devtimePlugins.filter(Boolean),
    ...routerAndLayoutPlugins.filter(Boolean),
    ...autoImportPlugins.filter(Boolean),
  ];
};
