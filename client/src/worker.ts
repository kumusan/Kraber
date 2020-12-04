import { import_wasm, call } from './wasm_call'

import_wasm();
// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

ctx.addEventListener('message', async event => {
  call();
  ctx.postMessage({ output: 'アウトぷとテスト' });
})

export { }