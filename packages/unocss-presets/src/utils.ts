import type { UnocssColorItem } from './types';

export const parseCssVarName = (rawName: string, prefix?: string) => {
  const cssPrefix = !prefix || prefix === '' ? '--' : `--${prefix}-`;
  return `var(${cssPrefix}${rawName})`;
};

export const extractCssVarName = (css: `var(${string})` | string) => {
  return css.match(/var\((.+)\)/)?.[1] ?? '';
};

export const trySetColor = ({
  target,
  prefix,
  name,
  idx,
}: {
  target: Partial<UnocssColorItem>;
  prefix: string;
  name: string;
  idx: number;
}) => {
  const colorVal = parseCssVarName(`${name}-${idx}`, prefix);
  if (idx === 1) {
    target['shallow'] = colorVal;
  }
  if (idx === 2) {
    target['text-disabled'] = colorVal;
  }
  if (idx === 3) {
    target['disabled'] = colorVal;
  }
  if (idx === 4) {
    target['special'] = colorVal;
  }
  if (idx === 5) {
    target['hover'] = colorVal;
  }
  if (idx === 6) {
    target['DEFAULT'] = colorVal;
    target['regular'] = colorVal;
  }
  if (idx === 7) {
    target['active'] = colorVal;
  }
  target[idx] = colorVal;
  target[idx * 100] = colorVal;
};
