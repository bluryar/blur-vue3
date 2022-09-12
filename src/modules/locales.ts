import dayjs from 'dayjs';
import type { App } from 'vue';
export function setupLocale(app: App) {
  dayjs.locale('zh-cn');
  return app;
}
