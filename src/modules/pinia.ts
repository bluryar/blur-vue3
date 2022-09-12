import type { App } from 'vue';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

export function setupPinia(app: App) {
  const pinia = createPinia();
  pinia.use(
    createPersistedState({
      storage: sessionStorage,
    }),
  );
  app.use(pinia);
  return app;
}
