import React from 'react';
import logo from './logo.svg';
import './App.css';
// eslint-disable-next-line
import Worker from 'worker-loader!./worker'
import { import_wasm } from './wasm_call';

let worker: Worker;

function App() {

  React.useEffect(() => {
    worker = new Worker();
    worker.addEventListener('message', exec)
  }, []);

  const exec = () => {
    worker.onmessage = (event: { data: String }) => {
      console.log(`return data ${event.data}`);
    };
    worker.postMessage('送ったデータ');
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={exec}>test</button>
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
        <canvas id="canvas" />
      </div>
    </div>
  );
}

export default App;
