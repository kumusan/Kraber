let wasm: any;

const import_wasm = async () => {
  await import('wasm').then(module => {
    wasm = module;
  })
  .catch(err => console.log(err));
}

// fragで構文エラーが発生する。
export const call = async (canvas: HTMLCanvasElement, vert: string, frag: string) => {
  if (!wasm) {
    console.log('import now')
    await import_wasm();
  }
  // ここ呼び出しだけ
  wasm.run_shader(canvas, vert, frag);
  // requestAnimationFrame(() => wasm.render(canvas, location));
}

