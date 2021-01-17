let wasm: any;

const import_wasm = async () => {
  await import('wasm').then(module => {
    wasm = module;
  })
  .catch(err => console.log(err));
}

// fragで構文エラーが発生する。
export const call = async (vert: string, frag: string) => {
  if (!wasm) {
    console.log('import now')
    await import_wasm();
  }
  wasm.run_shader(vert, frag);
}
