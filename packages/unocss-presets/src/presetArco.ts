import type { Preset, ThemeConfig } from 'unocss';

import { getNormalizePresetPalettes } from './gen';

export interface PresetArcoOptions {
  /**
   * 当你需要给css变量定义前缀，以区分不同组件库的cssVar时传入
   *
   * @default ''
   */
  cssVarPrefix?: string;
}

const parseCssVarName = (rawName: string, prefix?: string) => {
  const cssPrefix = !prefix || prefix === '' ? '--' : `--${prefix}-`;
  return `var(${cssPrefix}${rawName})`;
};

type UnocssColorItem = Record<
  number | 'DEFAULT' | 'active' | 'hover' | 'regular' | 'special' | 'disabled' | 'text-disabled' | 'shallow',
  string
>;

const trySetColor = ({
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

/**
 * @param type 采用那种设计体系下的design token，默认采用arco design的
 */
export function presetArco({ cssVarPrefix = '' }: PresetArcoOptions = {}): Partial<Preset<Partial<ThemeConfig>>> {
  const theme: Partial<ThemeConfig> = {
    colors: {},
  };

  // 这里只用到了色板名称
  const colors = getNormalizePresetPalettes('arco');

  // 设置基础调色板
  theme.colors = colors
    .filter(({ mode }) => mode === 'light')
    .reduce<Record<string, UnocssColorItem>>((prev, curr) => {
      const res: Partial<UnocssColorItem> = {};
      curr.colors.forEach((_, idx) => {
        trySetColor({ target: res, prefix: cssVarPrefix, name: 'color-' + curr.name, idx: idx + 1 });
      });
      prev[curr.name] = res as UnocssColorItem;
      return prev;
    }, {});

  // neutral => gray 中性色alias
  // primary\secondary\success\warning\danger\link\neutral
  ['primary', 'success', 'warning', 'danger', 'link', 'neutral'].forEach((name) => {
    const res: Partial<UnocssColorItem> = {};
    Array.from({ length: 10 }).forEach((_, idx) => {
      trySetColor({ target: res, prefix: cssVarPrefix, name: 'color-' + name, idx: idx + 1 });
    });
    theme!.colors![name] = res;
  });
  theme!.colors!.neutral = Array.from({ length: 10 }).reduce<UnocssColorItem>((prev, _, idx) => {
    trySetColor({ target: prev, prefix: cssVarPrefix, name: 'color-neutral', idx: idx + 1 });
    return prev;
  }, Object.create(null));
  theme!.colors['secondary'] = {
    DEFAULT: parseCssVarName('color-secondary', cssVarPrefix),
    hover: parseCssVarName('color-secondary-hover', cssVarPrefix),
    active: parseCssVarName('color-secondary-active', cssVarPrefix),
    disabled: parseCssVarName('color-secondary-disabled', cssVarPrefix),
  };

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
    '1': '2px',
    '2': '4px',
    '3': '6px',
    '4': '8px',
    '5': '10px',
    '6': '12px',
    '7': '16px',
    '8': '20px',
    '9': '24px',
    '10': '32px',
    '11': '36px',
    '12': '40px',
    '13': '48px',
    '14': '56px',
    '15': '60px',
    '16': '64px',
    '17': '72px',
    '18': '80px',
    '19': '84px',
    '20': '96px',
    '21': '100px',
    '22': '120px',
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
    /** 容器类组件的背景色 */
    bg: {
      1: parseCssVarName('color-bg-1', cssVarPrefix),
      overall: parseCssVarName('color-bg-1', cssVarPrefix),
      all: parseCssVarName('color-bg-1', cssVarPrefix),
      whole: parseCssVarName('color-bg-1', cssVarPrefix),
      2: parseCssVarName('color-bg-2', cssVarPrefix),
      primary: parseCssVarName('color-bg-2', cssVarPrefix),
      first: parseCssVarName('color-bg-2', cssVarPrefix),
      3: parseCssVarName('color-bg-3', cssVarPrefix),
      secondary: parseCssVarName('color-bg-3', cssVarPrefix),
      second: parseCssVarName('color-bg-3', cssVarPrefix),
      4: parseCssVarName('color-bg-4', cssVarPrefix),
      tertiary: parseCssVarName('color-bg-4', cssVarPrefix),
      third: parseCssVarName('color-bg-4', cssVarPrefix),
      5: parseCssVarName('color-bg-5', cssVarPrefix),
      popup: parseCssVarName('color-bg-5', cssVarPrefix),
      tooltip: parseCssVarName('color-bg-5', cssVarPrefix),
      white: parseCssVarName('color-bg-white', cssVarPrefix),
    },
  };

  theme.textColor = {
    title: parseCssVarName('color-text-1', cssVarPrefix),
    'sub-title': parseCssVarName('color-text-1', cssVarPrefix),
    info: parseCssVarName('color-text-1', cssVarPrefix),
    'sub-info': parseCssVarName('color-text-1', cssVarPrefix),
  };

  theme.animation = {};

  theme.transitionDuration = {
    1: '0.1s',
    2: '0.2s',
    3: '0.3s',
    4: '0.4s',
    5: '0.5s',
    loading: '1s',
  };

  theme.transitionTimingFunction = {
    // 线性
    linear: 'cubic-bezier(0, 0, 1, 1)',
    // 标准
    standard: 'cubic-bezier(0.34, 0.69, 0.1, 1)',
    // 过冲
    overshoot: 'cubic-bezier(0.3, 1.3, 0.3, 1)',
    // 减速
    decelerate: 'cubic-bezier(0.4, 0.8, 0.74, 1)',
    // 加速
    accelerate: 'cubic-bezier(0.26, 0, 0.6, 0.2)',
  };

  return {
    name: '@bluryar/preset-arco',
    theme,
    rules: [],
    preflights: [
      {
        getCSS: ({}) => {
          return `
html {
  font-size: 14px;
}

body {
  background-color: ${parseCssVarName('color-bg-1', cssVarPrefix)};
  color: ${parseCssVarName('color-text-2', cssVarPrefix)};
}
      `;
        },
      },
    ],
  };
}
