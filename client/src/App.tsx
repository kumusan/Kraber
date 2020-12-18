import React from 'react';
import './App.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./wasm.worker';
import Editor from './components/editor'

const v = `
  attribute vec3 position;
  uniform mat4 mvpMatrix;
  void main() {
      gl_Position = mvpMatrix * vec4(position, 1.0);
  }
`
const f = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`

// eslint-disable-next-line no-restricted-globals 
let canvas: HTMLCanvasElement | Window = self

function init(isWorker: boolean) {
  if (isWorker) {
    worker.terminate();
  }
  worker = new Worker();

  document.getElementById('canvas-container')!.innerHTML = '<canvas id="canvas"></canvas>'
  canvas = document.getElementById('canvas')! as HTMLCanvasElement;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

let worker: Worker;

function App() {
  React.useEffect(() => {
    init(false);
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const offscreen = canvas.transferControlToOffscreen();
    worker.postMessage({
      canvas: offscreen,
      vert: v,
      frag: f,
    }, [offscreen]);
  });

  // 入力が変更されたときの処理
  function test() {
    init(true);

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const offscreen = canvas.transferControlToOffscreen();
    worker.postMessage({
      canvas: offscreen,
      vert: v,
      frag: f,
    }, [offscreen]);
  }
  return (
    <div className="App">
      <div id="backgroun">
        <div id="canvas-container" />
      </div>
      <Editor />
      <button onClick={() => test()}>test</button>
    </div>
  );
}

export default App;
