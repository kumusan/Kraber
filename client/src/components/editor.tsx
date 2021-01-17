import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
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

const EditorFocus = styled.div`
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  color: white;
  position: absolute;
  z-index: 2;
  text-shadow: rgba( 0, 0, 0, 1 ) 0px 1px 2px;
  height: 100vh;
  width: 100vh;
  opacity: 0.5;
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
  }, [editor])

  return (
    <EditorFocus onClick={focus}>
      <button onClick={() => console.log(editorState)}>1111</button>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
        />
    </EditorFocus>
  )
}

export default EditorComponent;
