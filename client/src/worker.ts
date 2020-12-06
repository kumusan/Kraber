import { call, import_wasm } from './wasm_call'

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

ctx.addEventListener('message', ({ data }) => {
// eslint-disable-next-line no-restricted-globals
  window = self;
  if (data.type === 'init') {
    import_wasm();
    ctx.postMessage('init run');
  } else if (data.type === 'render') {
    call();
    ctx.postMessage('render run');
  }
})

export { }