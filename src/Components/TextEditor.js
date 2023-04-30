import React, { useEffect, useState } from 'react';
import { Quill } from 'react-quill';
import { useQuill } from 'react-quilljs';
/*
const TextEditor = ( {setValue, value} ) => {
    const [ editor, setEditor ] = useState(false)
    const { quill, quillRef } = new Quill('#editor-container', {
        modules: {
            toolbar: [
                ['bold', 'italic', 'link', 'strike', { 'script': 'super' }],
                [ {header: 2},  { 'list': 'bullet'}, { 'list': 'ordered' }, 'blockquote', 'code' ],
                [ 'image', 'video']
                ]
        },
        placeholder: 'Text (Optional)',
        theme: 'snow'
      });
  
    useEffect(() => {
        if (quill) {
            quill.on('text-change', (delta, oldDelta, source) => {
              console.log(quill.getText()); // Get text only
              setValue(quill.getContents())
              console.log(quill.getContents()); // Get delta contents
              console.log(quill.root.innerHTML); // Get innerHTML using quill
              console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
            });
          }
      }, [quill]);

        var Delta = Quill.import('delta');
        var delta = new Delta(JSON.parse(delta));
        var oldDelta = quill.getContents()
        var combinedDelta = oldDelta.concat(delta);
        quill.setContents(combinedDelta)

        return (
            <div id="editor-container">
                <div ref={quillRef} />
            </div>
        )
      
}
export default TextEditor
*/

const TextEditor = ( {setValue, value, setHtml, html, quill, quillRef} ) => {


    useEffect(() => {


    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        console.log(quill.getText()); // Get text only
        setValue(JSON.stringify(quill.getContents()))
        console.log(quill.getContents()); // Get delta contents
        console.log(quill.root.innerHTML); // Get innerHTML using quill
        setHtml(quill.root.innerHTML)
        console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill]);

    return (
        <div id='editor-container'>
            <div ref={quillRef} />
        </div>
    )
}

export default TextEditor
