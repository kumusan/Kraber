import React, { useState, useRef } from 'react';
import { Editor, EditorState } from 'draft-js';

function EditorComponent() {

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const editor = useRef(null);

  function focus() {
    // @ts-ignore
    editor.current.focus();
  }

  return (
    <Editor
      ref={editor}
      editorState={editorState}
      onChange={setEditorState}
    />
  );
}

export default EditorComponent;
