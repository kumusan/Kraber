import React, { useState, useRef } from 'react';
import './editor.css'
import { Editor, EditorState } from 'draft-js';
import { call } from './wasm'

const v = `
  attribute vec3 position;

  void main(void){
    gl_Position = vec4(position, 1.0);
  }
`
  // uniform float time;
  // uniform vec2  mouse;
const f = `
  precision mediump float;
  uniform vec2  resolution;

  void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec2 color = (vec2(1.0) + p.xy) * 0.5;
    gl_FragColor = vec4(color, 0.0, 1.0);
  }
`

type Props = {
  canvas: HTMLCanvasElement
}

function EditorComponent(props: Props) {

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const editor = useRef(null);

  function focus() {
    // @ts-ignore
    editor.current.focus();
  }

  call(props.canvas, v, f);

  return (
    <div id="editor" onClick={focus}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        placeholder="This is Test"
      />
    </div>
  );
}

export default EditorComponent;
