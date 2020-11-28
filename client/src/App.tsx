import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  import('wasm').then(module => {
    const sum = module.add_test(10, 20);
    console.log(sum)
    const test_data = ""
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div id="backgroun">
        <canvas id="canvas" />
      </div>
    </div>
  );
}

export default App;
