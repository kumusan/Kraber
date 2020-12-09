// eslint-disable-next-line no-restricted-globals
self.onmessage = (event: any)=> {
  const data = event.data;
  const canvas = data.canvas.getContext('webgl');
  console.log(' in message ');
  if (data.vert) {
    call(canvas, data.vert, data.frag);
  }
}

let wasm: any;

const import_wasm = async () => {
  console.log(1)
  await import('wasm').then(module => {
    wasm = module;
    console.log(2)
  })
  .catch(err => console.log(err));
}

// fragで構文エラーが発生する。
const call = async (canvas: HTMLCanvasElement, vert: String, frag: String) => {
  if (!wasm) {
    await import_wasm();
  }
  console.log(5)
  wasm.run_shader(canvas, vert, frag)
  console.log('run')
}

export { }
