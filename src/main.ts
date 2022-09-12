import type { DefineComponent } from 'vue';
import { createApp } from 'vue';
import AppRoot from './App.vue';

import 'uno.css';
// 通用字体
import 'vfonts/Lato.css';

import { setupRouter, setupPinia, setupLocale, setupHead } from './modules';

function setupApp(AppComponent: DefineComponent) {
  const app = createApp(AppComponent);

  setupLocale(app);
  setupHead(app);
  setupRouter(app);
  setupPinia(app);

  app.mount('#app');
}

setupApp(AppRoot as any);
