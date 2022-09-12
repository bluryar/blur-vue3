// src/histoire.setup.ts
import { defineSetupVue3 } from '@histoire/plugin-vue';

import 'uno.css';
// 通用字体
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';
import './styles/histoire.css';

import { setupPinia } from './modules/pinia';
import { setupLocale } from './modules/locales';
import { setupHead } from './modules/head';

export const setupVue3 = defineSetupVue3(({ app }) => {
  setupLocale(app);
  setupHead(app);
  setupPinia(app);
});
