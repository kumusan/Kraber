let wasm: any;

import('wasm').then(module => {
  console.log(typeof module);
  wasm = module;
  const sum = module.add_test(10, 20);
  console.log(sum);
})

// 関数呼び出しているだけでworkerを使用していない。
// 明日やる

// fragで構文エラーが発生する。
export const call = async () => {
  const v = `
    attribute vec4 position;
    attribute vec4 color;
    uniform mat4 mvpMatrix;
    varying vec4 vColor;

    void main(void) {
      vColor = color;
      gl_Position = mvpMatrix * position;
    }
  `
  const f = `
    varying vec4 vColor;
    void main(void){
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `

  wasm.run_shader(true, v, f)
}