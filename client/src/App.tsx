import React from 'react';
import './App.css';
import EditorComponent from './components/editor'

function App() {

  return (
    <div className="App">
      <canvas id="canvas"></canvas>
      <EditorComponent />
    </div>
  );
}

export default App;
