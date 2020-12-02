import React from 'react';
import logo from './logo.svg';
import './App.css';
import { call } from './worker/call.worker';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={() => call()}>test</button>
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
