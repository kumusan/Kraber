import React, { useRef, useEffect } from 'react';
import './App.css';
import EditorComponent from './components/editor'

function App() {

  let canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
  }, []);


  return (
    <div className="App">
      <div id="backgroun">
        <canvas id="canvas" ref={canvasRef}></canvas>
        <p><input type="checkbox" id="check" checked onChange={() => console.log(1)} /><label htmlFor="check"> auto run</label></p>
      </div>
      <EditorComponent canvas={canvasRef.current!} />
      {/* <button onClick={() => test(ref)}>test</button> */}
    </div>
  );
}

export default App;
