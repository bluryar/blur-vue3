import type { UserConfig } from 'unocss';
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
  transformerAttributifyJsx,
} from 'unocss';
import PresetRemToPx from '@unocss/preset-rem-to-px';
import { presetScrollbar } from 'unocss-preset-scrollbar';

export const iconsOptions: Parameters<typeof presetIcons>[0] = {
  scale: 1.2,
  extraProperties: { display: 'inline-block', 'vertical-align': 'middle' },
  warn: true,
};

const CustomConfig: UserConfig = {
  safelist: ['font-mono'],
  exclude: [
    'node_modules',
    '.git',
    '.github',
    '.husky',
    '.vscode',
    'build',
    'dist',
    'mock',
    'public',
    './stats.html',
    '.vite-inspect',
  ],
  presets: [
    presetUno({
      dark: {
        light: '',
        dark: '.dark',
      },
    }),
    presetAttributify(),
    presetIcons(iconsOptions),
    presetScrollbar(),
    PresetRemToPx(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerAttributifyJsx()],
  shortcuts: [
    [/^(s|size|wh|square)-(.*)$/, ([, , c]) => `w-${c} h-${c}`],
    [/^circle-(.*)$/, ([, c]) => `wh-${c} rounded-full`],
    ['flex-center', 'flex justify-center items-center'],
    ['flex-col-center', 'flex-center flex-col'],
    ['flex-x-center', 'flex justify-center'],
    [
      /^(inline-flex|flex)-(x|y)-(center|between|around|start|end|baseline|stretch|evenly)$/,
      ([, type, direction, behavior]) => `${type} ${direction === 'x' ? 'justify-' : 'items-'}${behavior}`,
    ],
    ['flex-y-center', 'flex items-center'],
    ['i-flex-center', 'inline-flex justify-center items-center'],
    ['i-flex-x-center', 'inline-flex justify-center'],
    ['i-flex-y-center', 'inline-flex items-center'],
    ['flex-col', 'flex flex-col'],
    ['flex-col-stretch', 'flex-col items-stretch'],
    ['i-flex-col', 'inline-flex flex-col'],
    ['i-flex-col-stretch', 'i-flex-col items-stretch'],
    ['flex-1-hidden', 'flex-1 overflow-hidden'],
    ['absolute-lt', 'absolute left-0 top-0'],
    ['absolute-lb', 'absolute left-0 bottom-0'],
    ['absolute-rt', 'absolute right-0 top-0'],
    ['absolute-rb', 'absolute right-0 bottom-0'],
    ['absolute-tl', 'absolute-lt'],
    ['absolute-tr', 'absolute-rt'],
    ['absolute-bl', 'absolute-lb'],
    ['absolute-br', 'absolute-rb'],
    ['translate-top-center', 'absolute top-50% transform-y--50%'],
    ['translate-bottom-center', 'absolute bottom-50% transform-y--50%'],
    ['translate-left-center', 'absolute left-50% transform-x--50%'],
    ['translate-right-center', 'absolute right-50% transform-x--50%'],
    ['absolute-center', 'absolute-lt flex-center wh-full'],
    ['fixed-lt', 'fixed left-0 top-0'],
    ['fixed-lb', 'fixed left-0 bottom-0'],
    ['fixed-rt', 'fixed right-0 top-0'],
    ['fixed-rb', 'fixed right-0 bottom-0'],
    ['fixed-tl', 'fixed-lt'],
    ['fixed-tr', 'fixed-rt'],
    ['fixed-bl', 'fixed-lb'],
    ['fixed-br', 'fixed-rb'],
    ['fixed-center', 'fixed-lt flex-center wh-full'],
    ['transition-base', 'transition-all duration-300 ease-in-out]'],
  ],
};

export default defineConfig(CustomConfig);
