// src/histoire.setup.ts
import { defineSetupVue3 } from '@histoire/plugin-vue';
import Clipboard from 'clipboard';

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

try {
  // Node js will throw an error
  this === window;

  const domList = document.querySelectorAll('.markdown-it-code-copy[data-markdown-it-code-copy]');
  new Clipboard('.markdown-it-code-copy[data-markdown-it-code-copy]');
  domList.forEach((dom) => {
    dom?.addEventListener('click', () => {
      dom.children[0]?.setAttribute('style', 'display: block');
      dom.children[1]?.setAttribute('style', 'display: none');

      setTimeout(() => {
        dom.children[1]?.setAttribute('style', 'display: block');
        dom.children[0]?.setAttribute('style', 'display: none');
      }, 300);
    });
  });
} catch (_err) {}
