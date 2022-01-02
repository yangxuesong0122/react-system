import React, {Component} from 'react'
import {Upload, Modal, message} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from "../../utils/constants"

export default class PicturesWall extends Component {
  state = {
    previewVisible: false, // 大图预览
    previewImage: '', // 大图 url
    previewTitle: '',
    fileList: []
  }
  static propTypes = {
    imgs: PropTypes.array
  }
  constructor(props) {
    super(props)
    let fileList = []
    const {imgs} = this.props
    if (imgs && imgs.length) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }
    this.state = {
      previewVisible: false, // 大图预览
      previewImage: '', // 大图 url
      previewTitle: '',
      fileList
    }
  }

  // 关闭Modal
  handleCancel = () => this.setState({ previewVisible: false })
  // 大图预览
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.rawName
    })
  }
  // 图片上传事件
  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      const res = file.response
      if (res.status === 0) {
        message.success('上传图片成功!')
        const {name, url} = res.data
        file.url = url
        file.rawName = file.name
        file.name = name
      } else {
        message.success('上传图片失败!')
      }
    } else if (file.status === 'removed') { // 删除图片
      const res = await reqDeleteImg(file.name)
      if (res.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }
    this.setState({ fileList }, () => {
      console.log(this.state.fileList)
    })
  }
  // 获取所有已上传图片文件名的数组
  getImgs = () => {
    return this.state.fileList.map(item => item.name)
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传图片</div>
      </div>
    )
    return (
      <>
        <Upload
          action="/manage/img/upload"
          accept='image/*' /*只接收图片格式*/
          listType="picture-card" /*卡片样式*/
          name='image' /*请求参数名*/
          fileList={fileList} /*所有已上传图片文件对象的数组*/
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    )
  }
}