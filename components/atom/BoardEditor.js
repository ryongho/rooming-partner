import React, { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle } from 'react'

const BoardEditor = forwardRef(({ onAddImage, defaultValue = '<p><br /></p>' }, ref) => {
    const editorRef = useRef()
    useImperativeHandle(ref, () => ({
        getContentHTML: () => {
            const editor = editorRef.current.getEditor()
            const unprivilegedEditor = editorRef.current.makeUnprivilegedEditor(editor)
            return unprivilegedEditor.getHTML()
        }
    }))

    const imageHanlder = async () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', '.jpg,.png,.jpeg')
        input.click()

        input.onchange = async () => {
            
            let file = input.files[0]
            onAddImage(file, (url) => {
                if (url) {
                    const range = editorRef.current.getEditorSelection()
                    editorRef.current.getEditor().insertEmbed(range.index, 'image', url)
                }
            })
        }
    }

    if (typeof window === 'undefined') {
        return <Fragment></Fragment>
    } else {
        const ReactQuill = require('react-quill')
        require('react-quill/dist/quill.snow.css')
        const modules = {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline','strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                    ['image'],
                    [{ 'align': [] }, { 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    ['clean']
                ],
                handlers: {
                    image: imageHanlder
                }
            },
            clipboard: {
                matchVisual: false
            }
        }
        
        const formats = [
            //'font',
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image', 'video',
            'align', 'color', 'background',        
        ]
    
        
        return (
            <ReactQuill
                ref={editorRef}
                style={{height: '540px', fontSize: '14px', lineHeight: '1.5', maxWidth:'850px', marginBottom:'46px'}}
                theme={'snow'}
                modules={modules}
                formats={formats}
                defaultValue={defaultValue}
                placeholder={'내용을 입력해 주세요.'} />
        )
    }  
})

export default BoardEditor