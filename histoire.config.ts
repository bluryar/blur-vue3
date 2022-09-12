// import CustomImportResolver from './setup/unplugin-auto-import/custom-resolver';
import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue';
import { pathResolve } from './setup/utils/path';

/**
 * @param dirname 相对于当前文件所在路径
 * @param icon emoji
 */
const createGroup = (dirname: string, icon: string) => {
  const tmpl = {
    id: dirname,
    title: `${icon} ${dirname} ${icon}`,
    include: (file) => {
      const absPath = pathResolve(file.path);
      return new RegExp(`packages/${dirname}/(.+).story.vue$`).test(absPath);
    },
  };
  return tmpl;
};

export default defineConfig({
  // TODO 等待官方推出jsx/tsx插件
  plugins: [HstVue()],

  tree: {
    groups: [createGroup('hooks', '🛠️'), createGroup('components', '🧊')],
  },

  theme: {
    title: '📑 bluryar 前端文档库',
    favicon: 'vite.svg',
  },

  // * 每个.story.vue都会被这个文件导出的方法包裹
  setupFile: pathResolve('src/histoire.setup.ts'),

  sandboxDarkClass: 'dark',

  // ! 当命令行报错：初`SyntaxError: Unexpected token 'export'`时，将对应的库名添加到这个数组中
  viteNodeInlineDeps: [/compute-scroll-into-view/],

  viteIgnorePlugins: [
    'unplugin-auto-import',
    'unplugin-vue-components',
    'vite-plugin-pages',
    'vite-plugin-vue-layouts',
    'vite-plugin-md',
  ],

  // 在components文件夹和hooks下就近新建一个`.story.vue`文件进行开发即可， 当然， 你也可以在story文件夹下开发
  storyMatch: ['packages/components/**/*.story.vue', 'packages/hooks/**/*.story.vue'],

  markdown(md) {
    return md;
  },
});
