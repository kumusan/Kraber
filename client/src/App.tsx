import React from 'react';
import './App.css';
import EditorComponent from './components/editor'

function App() {

  return (
    <div className="App">
      <div id="backgroun">
        <p><input type="checkbox" id="check" checked onChange={() => console.log(1)} /><label htmlFor="check"> auto run</label></p>
      </div>
      <EditorComponent />
    </div>
  );
}

export default App;
