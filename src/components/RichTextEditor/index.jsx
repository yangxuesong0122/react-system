import React, {Component} from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import PropTypes from 'prop-types'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.less'

export default class RichTextEditor extends Component {
  constructor(props) {
    super(props)
    const html = this.props.detail
    if (html) { // 有值创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        this.state = {
          editorState
        }
      } else {
        this.state = {
          editorState: EditorState.createEmpty()
        }
      }
    }
  }
  static propTypes = {
    detail: PropTypes.string
  }
  state = {
    editorState: EditorState.createEmpty()
  }
  // 编辑器回调
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    })
  }
  // 获取 输入的 html 文本
  getDetail = () => {
    const {editorState} = this.state
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }
  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url // 获取图片地址
          resolve({data: {link: url}})
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }
  render() {
    const {editorState} = this.state
    return (
      <div>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              uploadCallback: this.uploadImageCallBack,
              alt: { present: true, mandatory: true } }
          }}
        />
        {/*<textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />*/}
      </div>
    )
  }
}