import { merge, range } from 'lodash-es';
import Clipboard from 'clipboard';
import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import type Renderer from 'markdown-it/lib/renderer';

const RE = /([\d,-]+)/;

const CODE_COPY_CLASS = 'markdown-it-code-copy';
const CODE_COPY_ATTR = 'data-markdown-it-code-copy';

export const CODE_COPY_SELECTOR = `.${CODE_COPY_CLASS}[${CODE_COPY_ATTR}]`;
export const CODE_COPY_ICON = (options) =>
  `<svg class="${options.iconClass}" style="${options.iconStyle}" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"/><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"/></svg>`;
export const CODE_COPY_SUCCESS_ICON = (options) =>
  `<svg width="32" class="${options.iconClass} ${options.iconClass}--success" height="32" viewBox="0 0 1024 1024"><path fill="currentColor" d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5L207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"/></svg>`;

const defaultOptions = {
  iconStyle: '',
  iconClass: 'markdown-it-code-copy-icon',
  buttonStyle: 'position: absolute; bottom: 0; right: 0; margin: 8px; cursor: pointer; outline: none;',
  buttonClass: 'markdown-it-code-copy-button',
};

// eslint-disable-next-line max-params
function fenceHighlightLine(
  origRendered: string,
  tokens: Token[],
  idx: number,
  options: MarkdownIt.Options,
  env: any,
  self: Renderer,
) {
  const token = tokens[idx];

  if (token.tag !== 'code' || !token.attrs) {
    return origRendered;
  }
  const lineNumbers = RE.exec(token.attrs[0][0])[1]
    .split(',')
    .map((v) => {
      const [left, right] = v.split('-').map((v) => parseInt(v, 10));
      return range(left, right, 1);
    })
    .flat(1)
    .filter((num) => !Number.isNaN(num));

  const splitCode = origRendered.split('\n');
  const resCode = splitCode.map((code, idx) => {
    if (lineNumbers.includes(idx + 1)) {
      const res = code.replace(/<span class="line"/, '<span class="line highlighted"');
      return res;
    }

    return code;
  });

  return `${resCode.join('\n')}`;
}

const renderCode = (
  origRule: (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => string,
  pluginOptions,
) => {
  // eslint-disable-next-line no-param-reassign
  pluginOptions = merge(defaultOptions, pluginOptions);
  return (...args) => {
    const [tokens, idx, options, env, self] = args;
    const content = tokens[idx].content.replaceAll('"', '@#BLURYAR#@').replaceAll("'", '#@BLURYAR@#');
    const origRendered = origRule(tokens, idx, options, env, self);
    const highlightLineCode = fenceHighlightLine(origRendered, tokens, idx, options, env, self);

    if (content.length === 0) return origRendered;

    return `
<div style="position: relative">
	${highlightLineCode}
	<button ${CODE_COPY_ATTR} class="${CODE_COPY_CLASS} ${
      pluginOptions.buttonClass
    }" data-clipboard-text="${content}" style="${pluginOptions.buttonStyle}" title="Copy">
    ${CODE_COPY_SUCCESS_ICON(pluginOptions)}
    ${CODE_COPY_ICON(pluginOptions)}
	</button>
</div>
`;
  };
};

export default (md: MarkdownIt, options) => {
  md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block, options);
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence, options);
};

export function setMarkdownItCodeCopy(globalThis: Window) {
  if (!globalThis) return false;

  try {
    const domList = document.querySelectorAll(CODE_COPY_SELECTOR);
    // eslint-disable-next-line no-new
    new Clipboard(CODE_COPY_SELECTOR, {
      text(elem) {
        return elem
          .getAttribute('data-clipboard-text')
          .replace(/@#BLURYAR#@/g, '"')
          .replace(/#@BLURYAR@#/g, "'");
      },
    });
    domList.forEach((dom) => {
      dom?.addEventListener('click', () => {
        dom.children[0]?.setAttribute('style', 'display: block');
        dom.children[1]?.setAttribute('style', 'display: none');

        setTimeout(() => {
          dom.children[1]?.setAttribute('style', 'display: block');
          dom.children[0]?.setAttribute('style', 'display: none');
        }, 600);
      });
    });
  } catch (_err) {}
}
