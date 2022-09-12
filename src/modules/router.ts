/// <reference types="vite-plugin-pages/client" />
/// <reference types="vite-plugin-vue-layouts/client" />

import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import routes from '~pages';
import { setupLayouts } from 'virtual:generated-layouts';

const staticRoutes: RouteRecordRaw[] = [];

export function setupRouter(app: App) {
  const afterLayout = setupLayouts(routes);
  if (import.meta?.env?.DEV) {
    console.log('🚩 FILE_BASE_ROUTES_AND_LAYOUTS 基于文件系统的路由和布局');
    console.table(afterLayout);
  }
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...staticRoutes, ...afterLayout],
  });

  // TODO
  // router.beforeEach()

  app.use(router);
  return app;
}
