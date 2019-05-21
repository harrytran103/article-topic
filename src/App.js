import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Editor, EditorState } from 'draft-js';
import { ClipLoader } from 'react-spinners';

function App() {
  const [topics, setTopics] = useState([]);
  const [isFetchData, setIsFetchData] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const editor = useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  function fetchData() {
    // Clear topics.
    setTopics([]);
    // Set fetch data status.
    setIsFetchData(true);
    // Fecth data from api.
    fetch('https://api.github.com/users/cuongw/repos')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(_ => setTopics([]));
  }

  useEffect(() => {
    focusEditor();
  }, []);

  return (
    <div className="container p-5">
      <h1 className="text-success">Article Topic</h1>
      <div className="border rounded p-5 my-5" onClick={focusEditor}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={value => setEditorState(value)}
        />
      </div>
      <input
        className="form-control btn btn-success d-inline mb-5"
        type="button"
        value="Suggest a topic"
        onClick={fetchData}
      />
      {isFetchData && !topics.length && (
        <p className="text-center">
          <ClipLoader sizeUnit={'px'} size={40} color={'#123abc'} />
        </p>
      )}
      {topics.length > 0 &&
        topics.map((topic, index) => (
          <div className="border-bottom d-flex mb-5" key={index}>
            <p className="h4 text-primary w-100 ml-5">Topic</p>
            <p className="badge badge-danger mr-5">50%</p>
          </div>
        ))}
      <p className="text-secondary text-center">
        Made with ⌨️ and 🙌
        <br />
        <small className="text-secondary">© 2019 cuongw</small>
      </p>
    </div>
  );
}

export default App;
