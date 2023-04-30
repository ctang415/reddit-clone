import React, { useEffect } from "react";

const TextDisplay = ( {setValue, value, setHtml, html, quillRead, quillRef} ) => {


    useEffect(() => {
        if (quillRead) {
        quillRead.setContents(value)
    }
  }, [quillRead]);

    return (
        <div className='ql-editor'>
          
        </div>
    )
}

export default TextDisplay