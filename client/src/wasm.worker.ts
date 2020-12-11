interface Event {
  data: {
    canvas: OffscreenCanvas,
    vert: string,
    frag: string,
  }
}

// eslint-disable-next-line no-restricted-globals
self.onmessage = (event: Event)=> {
  const data = event.data;
  const canvas = data.canvas.getContext('webgl')!;
  call(canvas, data.vert, data.frag);
}

let wasm: any;

const import_wasm = async () => {
  await import('wasm').then(module => {
    wasm = module;
  })
  .catch(err => console.log(err));
}

// fragで構文エラーが発生する。
const call = async (canvas: WebGLRenderingContext, vert: string, frag: string) => {
  if (!wasm) {
    await import_wasm();
  }
  wasm.run_shader(canvas, vert, frag)
  console.log('run')
}

export { }
