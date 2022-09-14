import type { Preset, ThemeConfig } from 'unocss';

import { getNormalizePresetPalettes } from './gen';
import type { UnocssColorItem } from './types';
import { extractCssVarName, parseCssVarName, trySetColor } from './utils';

export interface PresetAntOptions {
  /**
   * @default "ant"
   *
   * css变量的前缀: `--ant-primary-6`
   */
  cssVarPrefix?: string;
}

// const utilColorsMap = new Map([
//   ['text-1', 'grey-10'],
//   ['text-2', 'grey-8'],
//   ['text-3', 'grey-6'],
//   ['text-4', 'grey-4'],
//   ['border-1', 'grey-2'],
//   ['border-2', 'grey-3'],
//   ['border-3', 'grey-4'],
//   ['border-4', 'grey-6'],
//   ['fill-1', 'grey-1'],
//   ['fill-2', 'grey-2'],
//   ['fill-3', 'grey-3'],
//   ['fill-4', 'grey-4'],
// ])

// const overrideColorsMap = new Map([
//   ['primary-color', 'primary-6'],
//   ['primary-color-hover:', 'primary-5'],
//   ['primary-color-active', 'primary-7'],
//   ['success-color', 'green-6'],
//   ['success-color-hover', 'green-5'],
//   ['success-color-active', 'green-7'],
//   ['success-color-deprecated-bg', 'green-1'],
//   ['success-color-deprecated-border', 'green-3'],
//   ['error-color', 'red-5'],
//   ['error-color-hover', 'red-4'],
//   ['error-color-active', 'red-6'],
//   ['error-color-deprecated-bg', 'red-1'],
//   ['error-color-deprecated-border', 'red-3'],
//   ['warning-color', 'gold-6'],
//   ['warning-color-hover', 'gold-5'],
//   ['warning-color-active', 'gold-7'],
//   ['warning-color-deprecated-bg', 'gold-1'],
//   ['warning-color-deprecated-border', 'gold-3'],
//   ['info-color', 'primary-6'],
//   ['info-color-deprecated-bg', 'primary-1'],
//   ['info-color-deprecated-border', 'primary-3'],
// ])

export const PresetAnt = ({ cssVarPrefix = 'ant' }: PresetAntOptions = {}): Preset<Partial<ThemeConfig>> => {
  const theme: Partial<ThemeConfig> = {
    colors: {},
  };
  const colors = getNormalizePresetPalettes('ant');

  const htmlCSSVarList = colors
    .filter(({ mode }) => mode === 'light')
    .map(({ name, colors }) =>
      colors
        .map((color, idx) => `${extractCssVarName(parseCssVarName(`${name}-${idx + 1}`, cssVarPrefix))}:${color};`)
        .join('\n'),
    )
    .join('\n');
  const htmlDarkCSSVarList = colors
    .filter(({ mode }) => mode === 'dark')
    .map(({ name, colors }) =>
      colors
        .map((color, idx) => `${extractCssVarName(parseCssVarName(`${name}-${idx + 1}`, cssVarPrefix))}:${color};`)
        .join('\n'),
    )
    .join('\n');
  // const htmlUtilCssVarList = Array.from(utilColorsMap.entries())
  //   .map(
  //     ([name, val]) =>
  //       `${extractCssVarName(parseCssVarName(`color-${name}`, cssVarPrefix))}:${parseCssVarName(val, cssVarPrefix)};`,
  //   )
  //   .join('\n')

  // const htmlOverrideCssVarList = Array.from(overrideColorsMap.entries())
  //   .map(
  //     ([name, val]) =>
  //       `${extractCssVarName(parseCssVarName(name, cssVarPrefix))}:${parseCssVarName(val, cssVarPrefix)};`,
  //   )
  //   .join('\n')

  const preflightsCss = `
  html {
    font-size: 14px;
  }
  
  html {
  ${htmlCSSVarList}
  
  ${extractCssVarName(parseCssVarName('color-text-1', cssVarPrefix))}: ${parseCssVarName('grey-10', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-text-2', cssVarPrefix))}: ${parseCssVarName('grey-8', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-text-3', cssVarPrefix))}: ${parseCssVarName('grey-6', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-text-4', cssVarPrefix))}: ${parseCssVarName('grey-4', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-border-1', cssVarPrefix))}: ${parseCssVarName('grey-2', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-border-2', cssVarPrefix))}: ${parseCssVarName('grey-3', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-border-3', cssVarPrefix))}: ${parseCssVarName('grey-4', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-border-4', cssVarPrefix))}: ${parseCssVarName('grey-6', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-fill-1', cssVarPrefix))}: ${parseCssVarName('grey-1', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-fill-2', cssVarPrefix))}: ${parseCssVarName('grey-2', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-fill-3', cssVarPrefix))}: ${parseCssVarName('grey-3', cssVarPrefix)};
  ${extractCssVarName(parseCssVarName('color-fill-4', cssVarPrefix))}: ${parseCssVarName('grey-4', cssVarPrefix)};
  
  ${extractCssVarName(parseCssVarName('color-bg', cssVarPrefix))}: #fff;
  }
  
  html.dark {
  ${htmlDarkCSSVarList}
  
  ${extractCssVarName(parseCssVarName('color-text-1', cssVarPrefix))}: rgba(255,255,255,0.9);
  ${extractCssVarName(parseCssVarName('color-text-2', cssVarPrefix))}: rgba(255,255,255,0.7);
  ${extractCssVarName(parseCssVarName('color-text-3', cssVarPrefix))}: rgba(255,255,255,0.5);
  ${extractCssVarName(parseCssVarName('color-text-4', cssVarPrefix))}: rgba(255,255,255,0.3);
  ${extractCssVarName(parseCssVarName('color-fill-1', cssVarPrefix))}: rgba(255,255,255,0.04);
  ${extractCssVarName(parseCssVarName('color-fill-2', cssVarPrefix))}: rgba(255,255,255,0.08);
  ${extractCssVarName(parseCssVarName('color-fill-3', cssVarPrefix))}: rgba(255,255,255,0.12);
  ${extractCssVarName(parseCssVarName('color-fill-4', cssVarPrefix))}: rgba(255,255,255,0.16);

  ${extractCssVarName(parseCssVarName('color-bg', cssVarPrefix))}: #17171a;
  }
  
  body {
    background-color: ${parseCssVarName('color-bg', cssVarPrefix)};
    color: ${parseCssVarName('color-text-1', cssVarPrefix)};
  }
        `;

  // 设置基础调色板
  theme.colors = colors
    .filter(({ mode }) => mode === 'light')
    .reduce<Record<string, UnocssColorItem>>((prev, curr) => {
      const res: Partial<UnocssColorItem> = {};
      curr.colors.forEach((_, idx) => {
        trySetColor({ target: res, prefix: cssVarPrefix, name: String(curr.name), idx: idx + 1 });
      });
      prev[curr.name] = res as UnocssColorItem;
      return prev;
    }, {});

  // 有些颜色不是ant-design-vue支持的, 但是我们可以通过preflights注入到运行时, 然后再下面的preflights中覆盖ant内置定义的变量, 统一使用方法
  ['primary', 'success', 'warning', 'error', 'info'].forEach((name) => {
    const res: Partial<UnocssColorItem> = {};
    Array.from({ length: 10 }).forEach((_, idx) => {
      trySetColor({ target: res, prefix: cssVarPrefix, name: String(name), idx: idx + 1 });
    });
    theme!.colors![name] = res;
  });

  theme.boxShadow = {
    none: 'none',
    special: '0 0 1px rgba(0, 0, 0, 0.3)',
    '1': '0 0 5px rgba(0, 0, 0, 0.1)',
    '1-center': '0 0 5px rgba(0, 0, 0, 0.1)',
    '1-up': '0 -2px 5px rgba(0, 0, 0, 0.1)',
    '1-down': '0 2px 5px rgba(0, 0, 0, 0.1)',
    '1-left': '-2px 0 5px rgba(0, 0, 0, 0.1)',
    '1-right': '2px 0 5px rgba(0, 0, 0, 0.1)',
    '1-left-up': '-2px -2px 5px rgba(0, 0, 0, 0.1)',
    '1-left-down': '-2px 2px 5px rgba(0, 0, 0, 0.1)',
    '1-right-up': '2px -2px 5px rgba(0, 0, 0, 0.1)',
    '1-right-down': '2px 2px 5px rgba(0, 0, 0, 0.1)',
    '2': '0 0 10px rgba(0, 0, 0, 0.1)',
    '2-center': '0 0 10px rgba(0, 0, 0, 0.1)',
    '2-up': '0 -4px 10px rgba(0, 0, 0, 0.1)',
    '2-down': '0 4px 10px rgba(0, 0, 0, 0.1)',
    '2-left': '-4px 0 10px rgba(0, 0, 0, 0.1)',
    '2-right': '4px 0 10px rgba(0, 0, 0, 0.1)',
    '2-left-up': '-4px -4px 10px rgba(0, 0, 0, 0.1)',
    '2-left-down': '-4px 4px 10px rgba(0, 0, 0, 0.1)',
    '2-right-up': '4px -4px 10px rgba(0, 0, 0, 0.1)',
    '2-right-down': '4px 4px 10px rgba(0, 0, 0, 0.1)',
    '3': '0 0 20px rgba(0, 0, 0, 0.1)',
    '3-center': '0 0 20px rgba(0, 0, 0, 0.1)',
    '3-up': '0 -8px 20px rgba(0, 0, 0, 0.1)',
    '3-down': '0 8px 20px rgba(0, 0, 0, 0.1)',
    '3-left': '-8px 0 20px rgba(0, 0, 0, 0.1)',
    '3-right': '8px 0 20px rgba(0, 0, 0, 0.1)',
    '3-left-up': '-8px -8px 20px rgba(0, 0, 0, 0.1)',
    '3-left-down': '-8px 8px 20px rgba(0, 0, 0, 0.1)',
    '3-right-up': '8px -8px 20px rgba(0, 0, 0, 0.1)',
    '3-right-down': '8px 8px 20px rgba(0, 0, 0, 0.1)',
  };

  theme.fontSize = {
    base: '14px',
    'body-3': '14px',
    'body-2': '13px',
    'body-1': '12px',
    caption: '12px',
    'title-1': '16px',
    'title-2': '20px',
    'title-3': '24px',
    'display-1': '36px',
    'display-2': '48px',
    'display-3': '56px',
  };

  theme.spacing = {
    none: '0',
    1: '2px',
    2: '4px',
    3: '6px',
    4: '8px',
    5: '10px',
    6: '12px',
    7: '16px',
    8: '20px',
    9: '24px',
    10: '32px',
    11: '36px',
    12: '40px',
    13: '48px',
    14: '56px',
    15: '60px',
    16: '64px',
    17: '72px',
    18: '80px',
    19: '84px',
    20: '96px',
    21: '100px',
    22: '120px',
  };

  const sizeType = [
    'width',
    'height',
    'maxWidth',
    'maxHeight',
    'minWidth',
    'minHeight',
    'inlineSize',
    'blockSize',
    'maxInlineSize',
    'maxBlockSize',
    'minInlineSize',
    'minBlockSize',
  ] as const;

  sizeType.forEach((type) => {
    if (!(type in theme)) {
      theme[type] = {};
    }
    Array.from({ length: 50 }).forEach((_, idx) => {
      const index = idx + 1;
      theme[type]![index] = `${index * 4}px`;
    });
    theme[type] = {
      none: '0px',
      mini: `${6 * 4}px`,
      small: `${7 * 4}px`,
      default: `${8 * 4}px`,
      large: `${9 * 4}px`,
    };
  });

  theme.borderWidth = {
    none: '0',
    1: '1px',
    2: '2px',
    3: '3px',
    4: '4px',
    5: '5px',
  };

  theme.borderRadius = {
    none: '0',
    small: '2px',
    medium: '4px',
    large: '8px',
    circle: '50%',
  };

  theme.borderColor = {
    light: parseCssVarName('color-border-1', cssVarPrefix),
    shallow: parseCssVarName('color-border-1', cssVarPrefix),
    tint: parseCssVarName('color-border-1', cssVarPrefix),
    DEFAULT: parseCssVarName('color-border-2', cssVarPrefix),
    normal: parseCssVarName('color-border-2', cssVarPrefix),
    regular: parseCssVarName('color-border-2', cssVarPrefix),
    deep: parseCssVarName('color-border-3', cssVarPrefix),
    heavy: parseCssVarName('color-border-4', cssVarPrefix),
  };

  theme.backgroundColor = {
    /** 小组件的填充色 */
    fill: {
      light: parseCssVarName('color-fill-1', cssVarPrefix),
      shallow: parseCssVarName('color-fill-1', cssVarPrefix),
      tint: parseCssVarName('color-fill-1', cssVarPrefix),
      DEFAULT: parseCssVarName('color-fill-2', cssVarPrefix),
      normal: parseCssVarName('color-fill-2', cssVarPrefix),
      regular: parseCssVarName('color-fill-2', cssVarPrefix),
      deep: parseCssVarName('color-fill-3', cssVarPrefix),
      heavy: parseCssVarName('color-fill-4', cssVarPrefix),
      1: parseCssVarName('color-fill-1', cssVarPrefix),
      2: parseCssVarName('color-fill-2', cssVarPrefix),
      3: parseCssVarName('color-fill-3', cssVarPrefix),
      4: parseCssVarName('color-fill-4', cssVarPrefix),
    },
  };

  theme.textColor = {
    title: parseCssVarName('color-text-1', cssVarPrefix),
    'sub-title': parseCssVarName('color-text-1', cssVarPrefix),
    info: parseCssVarName('color-text-1', cssVarPrefix),
    'sub-info': parseCssVarName('color-text-1', cssVarPrefix),
  };

  return {
    name: '@bluryar/preset-ant',
    theme,
    preflights: [
      {
        getCSS: () => {
          return preflightsCss;
        },
      },
    ],
  };
};
