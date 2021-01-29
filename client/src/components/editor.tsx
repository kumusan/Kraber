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
// const f = `
//   precision mediump float;
//   uniform vec2  resolution;

//   void main(void){
//     vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
//     vec2 color = (vec2(1.0) + p.xy) * 0.5;
//     gl_FragColor = vec4(color, 0.0, 1.0);
//   }
// `

const f = `
precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main(void){
    vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
    
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    int j = 0;
    vec2  x = p + vec2(-0.5, 0.0); 
    float y = 1.5 - mouse.x * 0.5;
    vec2  z = vec2(0.0, 0.0);
    
    for(int i = 0; i < 360; i++){
        j++;
        if(length(z) > 2.0){break;}
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x * y;
    }
    
    float h = mod(time * 20.0, 360.0) / 360.0;
    vec3 rgb = hsv(h, 1.0, 1.0);
    
    float t = float(j) / 360.0;
    
    gl_FragColor = vec4(rgb * t, 1.0);
    
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
  font-size: 12px;
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
    call(v, convertToRaw(editorState.getCurrentContent()).blocks[0].text);
    console.log('test')
  }, [editorState]);

  return (
    <EditorFocus onClick={focus}>
      {/* <button onClick={() => console.log(convertToRaw(editorState.getCurrentContent()).blocks[0].text)}>1111</button> */}
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
        />
    </EditorFocus>
  )
}

export default EditorComponent;
