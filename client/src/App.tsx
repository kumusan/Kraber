import React from 'react';
import logo from './logo.svg';
import './App.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./wasm.worker';
import Editor from './components/editor'

const v = `
  attribute vec4 position;
  void main() {
      gl_Position = position;
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={() => test()}>test</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div id="wasmcall"></div>
      <div id="backgroun">
        <div id="canvas-container" />
      </div>
      <Editor></Editor>
    </div>
  );
}

export default App;
