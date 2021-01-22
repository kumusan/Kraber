import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { call } from './wasm'

const v = `
  attribute vec3 position;

  void main(void){
    gl_Position = vec4(position, 1.0);
  }
`
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
  height: 100%;
  width: 100%;
  margin-top: 20px;
  margin-left: 20px;
  opacity: 0.1;
  transition: 0.6s;
  &:hover {
    opacity: 1.0;
  }
`

const init = EditorState.createWithContent(
  convertFromRaw({
    entityMap: {},
    blocks: [
      {
        key: "x12",
        text: f,
        type: "unstyled",
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        data: {},
      },
    ],
  })
);

function EditorComponent() {

  const [editorState, setEditorState] = useState(init);

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
      <button onClick={() => console.log(convertToRaw(editorState.getCurrentContent()).blocks[0].text)}>1111</button>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
        />
    </EditorFocus>
  )
}

export default EditorComponent;
