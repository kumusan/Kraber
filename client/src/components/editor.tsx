import React, { useState, useRef } from 'react';
import './editor.css'
import { Editor, EditorState } from 'draft-js';

function EditorComponent() {

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const editor = useRef(null);

  function focus() {
    // @ts-ignore
    editor.current.focus();
  }

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
