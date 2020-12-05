let wasm: any;

export const import_wasm = () => {
  import('wasm').then(module => {
    wasm = module;
  })
  .catch(err => console.log(err));
}

// 関数呼び出しているだけでworkerを使用していない。
// 明日やる

// fragで構文エラーが発生する。
export const call = async () => {
  const v = `
    attribute vec4 position;
    void main() {
        gl_Position = position;
    }
  `
    // varying vec4 vColor;
    // void main(void){
    //     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    // }
  const f = `
      void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
  `

  wasm.run_shader(true, v, f)
}