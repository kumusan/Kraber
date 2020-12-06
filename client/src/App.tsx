import React from 'react';
import logo from './logo.svg';
import './App.css';
// eslint-disable-next-line
import Worker from 'worker-loader!./worker'

let worker: Worker = new Worker();

function initWorker(): void {
  worker.addEventListener('message', e => {
    console.log('tets', e.data);
    worker.postMessage({ type: 'init '})
  })
}

function test(): any { 
  console.log('render test')
  worker.postMessage({ type: 'render' })
}

function App() {

  React.useEffect(() => {
    initWorker();
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={test()}>test</button>
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
