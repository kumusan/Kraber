import React, { useState, useRef, useEffect } from 'react';
import './editor.css'
import { Editor, EditorState, ContentState } from 'draft-js';
import { call } from './wasm'

const v = `
  attribute vec3 position;

  void main(void){
    gl_Position = vec4(position, 1.0);
  }
`
  // uniform float time;
  // uniform vec2  mouse;
    // vec2 color = (vec2(1.0) + p.xy) * 0.5;
const f = `
  precision mediump float;
  uniform float time;
  uniform vec2  resolution;

  void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float t = sin(0.5 * 30.0 + time * 5.0);
    gl_FragColor = vec4(vec3(t), 1.0);
  }
`

function EditorComponent() {

  // const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [editorState, setEditorState] = useState(() => EditorState.createWithContent(
    ContentState.createFromText(f)
  ));

  const editor = useRef(null);

  function focus() {
    // @ts-ignore
    editor.current.focus();
  }

  useEffect(() => {
    call(v, f);
  }, [])

  return (
    <div>
      <div id="editor" onClick={focus}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
        />
      </div>
    </div>
  );
}

export default EditorComponent;
