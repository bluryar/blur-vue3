import path from 'path';
import { fileURLToPath } from 'url';

export const pathResolve = (...dirs: string[]): string => {
  const [, dirname] = fileURLToPath(import.meta.url).match(/(.+)\/(.+)\.ts/);
  return path.resolve(dirname, '../../', ...dirs);
};
