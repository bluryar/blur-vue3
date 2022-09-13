/// <reference types="@histoire/plugin-vue/components" />
/// <reference types="@histoire/plugin-vue/components" />
/// <reference types="@ant-design/colors" />

import type { AttributifyAttributes } from '@unocss/preset-attributify';

import type { FunctionalComponent, TransitionProps } from 'vue';

declare module '@vue/runtime-core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HTMLAttributes extends AttributifyAttributes {}

  export interface TransitionProps {
    name:
      | 'fade-in'
      | 'slide-dynamic-origin'
      | 'slide-left'
      | 'slide-right'
      | 'slide-top'
      | 'slide-bottom'
      | 'zoom-in'
      | 'zoom-in-big'
      | 'zoom-in-left'
      | 'zoom-in-top'
      | 'zoom-in-bottom'
      | 'zoom-in-fade-out';
  }

  export interface GlobalComponents {
    Transition: FunctionalComponent<TransitionProps>;
  }
}

declare module '@ant-design/colors' {
  export type AntColorType =
    | 'red'
    | 'volcano'
    | 'gold'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'cyan'
    | 'blue'
    | 'geekblue'
    | 'purple'
    | 'magenta'
    | 'grey';
}

declare module 'unocss' {
  export interface ThemeConfig {
    // Responsiveness
    screens: Record<string, string>;

    // Reusable base configs
    colors: Record<string, any>;
    spacing: Record<string, string>;

    // Components
    container: Record<string, string>;

    // Utilities
    inset: ThemeConfig['spacing'];
    zIndex: Record<string, string>;
    order: Record<string, string>;
    gridColumn: Record<string, string>;
    gridColumnStart: Record<string, string>;
    gridColumnEnd: Record<string, string>;
    gridRow: Record<string, string>;
    gridRowStart: Record<string, string>;
    gridRowEnd: Record<string, string>;
    margin: ThemeConfig['spacing'];
    aspectRatio: Record<string, string>;
    height: ThemeConfig['spacing'];
    maxHeight: ThemeConfig['spacing'];
    minHeight: Record<string, string>;
    width: ThemeConfig['spacing'];
    maxWidth: Record<string, string>;
    minWidth: Record<string, string>;
    flex: Record<string, string>;
    flexShrink: Record<string, string>;
    flexGrow: Record<string, string>;
    flexBasis: ThemeConfig['spacing'];
    borderSpacing: ThemeConfig['spacing'];
    transformOrigin: Record<string, string>;
    translate: ThemeConfig['spacing'];
    rotate: Record<string, string>;
    skew: Record<string, string>;
    scale: Record<string, string>;
    animation: Record<string, string>;
    keyframes: Record<string, string>;
    cursor: Record<string, string>;
    scrollMargin: ThemeConfig['spacing'];
    scrollPadding: ThemeConfig['spacing'];
    listStyleType: Record<string, string>;
    columns: Record<string, string>;
    gridAutoColumns: Record<string, string>;
    gridAutoRows: Record<string, string>;
    gridTemplateColumns: Record<string, string>;
    gridTemplateRows: Record<string, string>;
    gap: ThemeConfig['spacing'];
    space: ThemeConfig['spacing'];
    divideWidth: ThemeConfig['borderWidth'];
    divideColor: ThemeConfig['borderColor'];
    divideOpacity: ThemeConfig['borderOpacity'];
    borderRadius: Record<string, string>;
    borderWidth: Record<string, string>;
    borderColor: ThemeConfig['colors'];
    borderOpacity: ThemeConfig['opacity'];
    backgroundColor: ThemeConfig['colors'];
    backgroundOpacity: ThemeConfig['opacity'];
    backgroundImage: Record<string, string>;
    gradientColorStops: ThemeConfig['colors'];
    backgroundSize: Record<string, string>;
    backgroundPosition: Record<string, string>;
    fill: ThemeConfig['colors'];
    stroke: ThemeConfig['colors'];
    strokeWidth: Record<string, string>;
    objectPosition: Record<string, string>;
    padding: ThemeConfig['spacing'];
    textIndent: ThemeConfig['spacing'];
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
    letterSpacing: Record<string, string>;
    textColor: ThemeConfig['colors'];
    textOpacity: ThemeConfig['opacity'];
    textDecorationColor: ThemeConfig['colors'];
    textDecorationThickness: Record<string, string>;
    textUnderlineOffset: Record<string, string>;
    placeholderColor: ThemeConfig['colors'];
    placeholderOpacity: ThemeConfig['opacity'];
    caretColor: ThemeConfig['colors'];
    accentColor: ThemeConfig['colors'];
    opacity: Record<string, string>;
    boxShadow: Record<string, string>;
    boxShadowColor: ThemeConfig['colors'];
    outlineWidth: Record<string, string>;
    outlineOffset: Record<string, string>;
    outlineColor: ThemeConfig['colors'];
    ringWidth: Record<string, string>;
    ringColor: ThemeConfig['colors'];
    ringOpacity: ThemeConfig['opacity'];
    ringOffsetWidth: Record<string, string>;
    ringOffsetColor: ThemeConfig['colors'];
    blur: Record<string, string>;
    brightness: Record<string, string>;
    contrast: Record<string, string>;
    dropShadow: Record<string, string>;
    grayscale: Record<string, string>;
    hueRotate: Record<string, string>;
    invert: Record<string, string>;
    saturate: Record<string, string>;
    sepia: Record<string, string>;
    backdropBlur: ThemeConfig['blur'];
    backdropBrightness: ThemeConfig['brightness'];
    backdropContrast: ThemeConfig['contrast'];
    backdropGrayscale: ThemeConfig['grayscale'];
    backdropHueRotate: ThemeConfig['hueRotate'];
    backdropInvert: ThemeConfig['invert'];
    backdropOpacity: ThemeConfig['opacity'];
    backdropSaturate: ThemeConfig['saturate'];
    backdropSepia: ThemeConfig['sepia'];
    transitionProperty: Record<string, string>;
    transitionTimingFunction: Record<string, string>;
    transitionDelay: Record<string, string>;
    transitionDuration: Record<string, string>;
    willChange: Record<string, string>;
    content: Record<string, string>;

    // Custom
    [key: string]: Record<string, string>;
  }
}

export {};
