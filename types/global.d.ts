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
