import type { AntColorType, PalettesProps } from '@ant-design/colors';
import { presetPalettes, presetDarkPalettes } from '@ant-design/colors';
import type { ArcoColorType } from '@arco-design/color';
import { generate, getPresetColors } from '@arco-design/color';
import type { Preset, ThemeConfig } from 'unocss';

export interface Options {
  /**
   * 决定根据何种算法生成调色板，arco的质感更加浪漫，ant则偏向务实
   *
   * @default 'arco'
   */
  type?: 'arco' | 'ant';

  /**
   * 当你需要给css变量定义前缀，以区分不同组件库的cssVar时传入
   *
   * @default ''
   */
  cssVarPrefix?: string;
}

interface NormalizePalettesRecord {
  /**
   * red\blue\yellow\gold\...
   */
  from: 'arco' | 'ant';
  name: string;
  mode: 'light' | 'dark';
  primary: string;
  colors: string[];
}

const getArcoNormalizePalettesRecordItem = (
  name: string,
  mode: 'light' | 'dark',
  item: ReturnType<typeof getPresetColors>[ArcoColorType],
): NormalizePalettesRecord => {
  return {
    from: 'arco',
    name,
    colors: item[mode],
    mode: mode,
    primary: item['primary'],
  };
};

export function getNormalizePresetPalettes(type: 'arco' | 'ant'): NormalizePalettesRecord[] {
  if (type === 'arco') {
    const preset = getPresetColors();
    return Object.keys(preset).reduce<NormalizePalettesRecord[]>((prev, curr) => {
      prev.push(getArcoNormalizePalettesRecordItem(curr, 'light', preset[curr as ArcoColorType]));
      prev.push(getArcoNormalizePalettesRecordItem(curr, 'dark', preset[curr as ArcoColorType]));
      return prev;
    }, []);
  } else if (type === 'ant') {
    let res: NormalizePalettesRecord[] = [];
    Object.keys(presetPalettes).forEach((key) => {
      const lightItem = presetPalettes[key];
      const darkItem = presetDarkPalettes[key];
      res.push({
        from: 'ant',
        mode: 'light',
        name: key,
        primary: lightItem['primary'] as string,
        colors: lightItem,
      });
      res.push({
        from: 'ant',
        mode: 'dark',
        name: key,
        primary: darkItem['primary'] as string,
        colors: darkItem,
      });
      delete lightItem['primary'];
      delete darkItem['primary'];
    });

    return res;
  }
  throw new Error('暂时只支持arco和ant的预设调色板');
}

const parseCssVarName = (rawName: string, prefix?: string) => {
  const cssPrefix = !prefix || prefix === '' ? '--' : `--${prefix}-`;
  return `var(${cssPrefix}${rawName})`;
};

type UnocssColorItem = Record<
  number | 'DEFAULT' | 'active' | 'hover' | 'regular' | 'special' | 'disabled' | 'text-disabled' | 'shallow',
  string
>;

const trySetColor = (target: Partial<UnocssColorItem>, name: string, idx: number) => {
  const colorVal = parseCssVarName(`${name}-${idx}`);
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
export function presetArco({ cssVarPrefix = 'color' }: Omit<Options, 'type'>): Partial<Preset<Partial<ThemeConfig>>> {
  const theme: Partial<ThemeConfig> = {
    colors: {},
  };

  // 这里只用到了色板名称
  const colors = getNormalizePresetPalettes('arco');

  // 设置基础调试版
  theme.colors = colors
    .filter(({ mode }) => mode === 'light')
    .reduce<Record<string, UnocssColorItem>>((prev, curr) => {
      const res: Partial<UnocssColorItem> = {};
      curr.colors.forEach((_, idx) => {
        trySetColor(res, cssVarPrefix + curr.name, idx + 1);
      });
      prev[curr.name] = res as UnocssColorItem;
      return prev;
    }, {});

  // neutral => gray 中性色alias
  // primary\info\secondary\success\warning\danger\link\neutral
  ['primary', 'success', 'warning', 'danger', 'link', 'neutral'].forEach((name) => {
    const res: Partial<UnocssColorItem> = {};
    Array.from({ length: 10 }).forEach((_, idx) => {
      trySetColor(res, cssVarPrefix + name, idx + 1);
    });
    theme!.colors![name] = res;
  });

  theme!.colors!.info = Array.from({ length: 10 }).reduce<UnocssColorItem>((prev, _, idx) => {
    trySetColor(prev, cssVarPrefix + 'neutral', idx + 1);
    return prev;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  }, {} as UnocssColorItem);
  theme!.colors!.neutral = Array.from({ length: 10 }).reduce<UnocssColorItem>((prev, _, idx) => {
    trySetColor(prev, cssVarPrefix + 'neutral', idx + 1);
    return prev;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  }, {} as UnocssColorItem);

  return {
    theme,
  };
}
