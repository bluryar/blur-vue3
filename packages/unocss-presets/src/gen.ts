import { presetPalettes, presetDarkPalettes } from '@ant-design/colors';
import type { ArcoColorType } from '@arco-design/color';
import { getPresetColors } from '@arco-design/color';

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
