/**
 * @desc `unplugin-auto-import`的resolver， 用于将本地的某些符合规则的方法自动引入到项目中。目前仅通过前后缀去匹配，建议设置较为复杂的匹配规则去做。
 *
 */

import type { ResolverFunction } from 'unplugin-auto-import/types';
type TargetUrl = string;
type TokenName = string;
type Prefix = string;
type Suffix = string;

/**
 * 自动引入本项目的通用模块
 *
 */
export interface CustomImportResolverOptions {
  /**
   * 目标文件所在的url, 一般是某个模块如`src/components/index.ts`, `src/hooks/index.ts`等形式的文件
   *
   * 本resolver将会把这个文件具名导出的内容 **作为自动引入的模块**.
   *
   * 即配合`unplugin-auto-import`可以免去引入这个文件导出的内容, 但是需要模块的作者手动将他们的内容引入到这个文件并且导出. 然后手动避免命名冲突
   */
  target: TargetUrl;

  /**
   * 方法名的前缀, 非常建议您设置一个符合项目情况的前缀, 一般为公司简称\库的简称, 或者use+简称
   *
   * 注意, 在`target`导出时需要符合该前缀, 建议在`target`文件和方法真正所在的文件都统一命名
   */
  prefix: string;

  /**
   * 方法名的后缀, 一般用于`pinia`定义的store方法
   * @default ""
   */
  suffix?: string;
}

const cache = new Map<TokenName, TargetUrl>();

const __createReturn = (name: TokenName, from: TargetUrl) => {
  if (!cache.has(name)) {
    cache.set(name, from);
  }
  return {
    name,
    from,
  };
};

/**
 * 用户可能不止一次使用该方法， 因此需要保存不同的前后缀和目标文件夹的映射关系
 */
const registerEffectNamePattern: Record<`${Prefix}--${Suffix}`, TargetUrl> = Object.create(null);

/**
 * 查找是否匹配，假如用户已经匹配过了，
 *
 * TODO 优化一下查找次数
 */
const __findUrlByName = (name: string) => {
  const prefixAndSuffix = Object.entries(registerEffectNamePattern).map(([key, target]) => {
    const [prefix, suffix] = key.split('--');
    return [prefix, suffix, target];
  });
  const targetList: { target: string; hasSuffix: boolean }[] = prefixAndSuffix.reduce(
    (prev, [prefix, suffix, target]) => {
      if (name.startsWith(prefix)) {
        if (suffix && name.endsWith(suffix)) {
          prev.push({ target: target, hasSuffix: !!1 });
          return prev;
        }
        prev.push({ target: target, hasSuffix: !!0 });
        return prev;
      }
      return prev;
    },
    [] as { target: string; hasSuffix: boolean }[],
  );

  if (!targetList.length) {
    return null;
  }

  if (targetList.length > 2) {
    throw new Error('[CustomImportResolver] 您不应该设置两个以上的相同的prefix，建议使用suffix获取其他prefix区分');
  }

  const hasSuffix = targetList.find((d) => d.hasSuffix);
  if (hasSuffix) {
    return hasSuffix.target;
  }

  return targetList[0].target;
};

/**
 * 自动引入本项目通用模块. 如`src/components`、`src/hooks`、`src/stores`等
 *
 * **该方法可以重复的使用**， 用于引入不同的内容
 */
export default function customImportResolver(options: CustomImportResolverOptions): ResolverFunction {
  const { target, prefix, suffix = '' } = options;

  const pattern = `${prefix}--${suffix}`;
  if (!(pattern in registerEffectNamePattern)) {
    registerEffectNamePattern[pattern] = target;
  } else {
    throw new Error('[CustomImportResolver] 请勿设置重复的`prefix`和`suffix`');
  }

  return (name: string) => {
    if (cache.has(name)) {
      return __createReturn(name, cache.get(name));
    }

    const foundTarget = __findUrlByName(name);
    if (foundTarget) {
      return __createReturn(name, foundTarget);
    }
  };
}
