import { merge } from 'lodash-es';
import Clipboard from 'clipboard';

const CODE_COPY_CLASS = 'markdown-it-code-copy';
const CODE_COPY_ATTR = 'data-markdown-it-code-copy';

export const CODE_COPY_SELECTOR = `.${CODE_COPY_CLASS}[${CODE_COPY_ATTR}]`;
export const CODE_COPY_ICON = (options) =>
  `<svg class="${options.iconClass}" style="${options.iconStyle}" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"/><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"/></svg>`;
export const CODE_COPY_SUCCESS_ICON = (options) =>
  `<svg width="32" class="${options.iconClass} ${options.iconClass}--success" height="32" viewBox="0 0 1024 1024"><path fill="currentColor" d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5L207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"/></svg>`;

try {
  // Node js will throw an error
  this === window;

  new Clipboard('.markdown-it-code-copy');
} catch (_err) {}

const defaultOptions = {
  iconStyle: '',
  iconClass: 'markdown-it-code-copy-icon',
  buttonStyle: 'position: absolute; top: 0; right: 0; margin: 8px; cursor: pointer; outline: none;',
  buttonClass: 'markdown-it-code-copy-button',
};

function renderCode(origRule, options) {
  options = merge(defaultOptions, options);
  return (...args) => {
    const [tokens, idx] = args;
    const content = tokens[idx].content.replaceAll('"', '&quot;').replaceAll("'", '&lt;');
    const origRendered = origRule(...args);

    if (content.length === 0) return origRendered;

    return `
<div style="position: relative">
	${origRendered}
	<button ${CODE_COPY_ATTR} class="${CODE_COPY_CLASS} ${options.buttonClass}" data-clipboard-text="${content}" style="${
      options.buttonStyle
    }" title="Copy">
    ${CODE_COPY_SUCCESS_ICON(options)}
    ${CODE_COPY_ICON(options)}
	</button>
</div>
`;
  };
}

export default (md, options) => {
  md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block, options);
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence, options);
};
