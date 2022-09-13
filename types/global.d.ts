/**
 * @desc
 * ! 不要使用`improt`\`export`关键字去引入， 如果要引入某个类型，请使用三反斜杠
 *
 * ! 只允许使用`declare`关键字声明全局的类型和全局变量（常量）
 */

/**
 * 抽取组件的props
 *
 * @example```ts
 * import Foo from '/path/to/Foo'
 *
 * // ...
 * type FooComponentProps = GetComponentPropsType<typeof Foo>
 * ```
 */
declare type GetComponentPropsType<Component> = import('vue').ExtractPropTypes<InstanceType<Component>['$props']>;

declare module '@arco-design/color' {
  export type ArcoColorType =
    | 'red'
    | 'orangered'
    | 'orange'
    | 'gold'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'cyan'
    | 'blue'
    | 'arcoblue'
    | 'purple'
    | 'pinkpurple'
    | 'magenta'
    | 'gray';

  /**
   * @param {string} color
   * @param {Object} options
   * @param {number} options.index 1 - 10 (default: 6)
   * @param {boolean} options.dark
   * @param {boolean} options.list
   * @param {string} options.format 'hex' | 'rgb' | 'hsl'
   *
   * @return string | string[]
   */
  export function generate(
    color: string,

    options: {
      /**
       * 生成 10 个梯度色中的第几个颜色。
       *
       * @default 6
       * */
      index: number;

      /**
       * 生成暗色色板的颜色。
       * */
      dark: boolean;

      /**
       * 生成包含十个颜色的梯度颜色数组。
       */
      list: boolean;

      /**
       * 生成颜色的格式。
       */
      format: 'hex' | 'rgb' | 'hsl';
    },
  );

  /**
   * 获得指定颜色的三通道 r, g, b 字符串。
   *
   * @example```js
   * getRgbStr('#F53F3F') // 245,63,63
   * ```
   */
  export function getRgbStr();

  /**
   * 包含了预设的 14 组颜色，包括一组中性灰。
   */
  export function getPresetColors(): Record<
    ArcoColorType,
    {
      light: string[];
      dark: string[];
      primary: string;
    }
  >;
}
