import React from 'react';
import styled from 'styled-components';
import EditorComponent from './components/editor'

const Canvas = styled.canvas`
  position: absolute;
  z-index: 1;
  display: block;
  height: 100%;
  width: 100%;
  margin: 0;
`

function App() {

  return (
    <div className="App">
      <Canvas id="canvas"></Canvas>
      <EditorComponent />
    </div>
  );
}

export default App;
