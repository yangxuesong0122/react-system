import React from 'react'
import {Modal, Form, Input, Select, message} from 'antd'
import PropTypes from 'prop-types'
import { reqAddCategory, reqUpdateCategory } from '../../../api/index'

const {Option} = Select

export default function Dialog(props) {
  const [form] = Form.useForm()
  const {showStatus, isModalVisible, row, categoryList, parentId} = props
  // 确定
  const handleOk = () => {
    form.validateFields().then(async values => {
      const { categoryName, parentId } = values
      let res
      if (showStatus === 1) {
        res = await reqAddCategory(categoryName, parentId)
      } else {
        res = await reqUpdateCategory({categoryId: row._id, categoryName})
      }
      if (res.status === 0) {
        props.changeVisible(false)
        form.resetFields()
        props.getCategoryList()
      } else {
        message.warning('操作失败，请重试')
      }
    }).catch(err => {
      return false
    })
  }
  // 取消
  const handleCancel = () => {
    form.resetFields()
    props.changeVisible(false)
  }
  // 分类选择回调
  const handleSelectChange = () => {
    console.log('变化了')
  }
  return (
    <Modal
      title={ showStatus === 1 ? '添加分类' : '更新分类' }
      visible={ isModalVisible }
      cancelText='取消'
      okText='确定'
      destroyOnClose={true}
      maskClosable={false}
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form
        form={form}
        preserve={false}>
        {showStatus === 1 ? (<Form.Item
          label="所属分类"
          name='parentId'
          initialValue={parentId}
          rules={[
            {required: true, message: '请选择所属分类!'}
          ]}>
          <Select
            placeholder="请选择分类"
            onChange={handleSelectChange}
            allowClear>
            <Option value="0">一级分类</Option>
            {
              categoryList.map(item => {
                return <Option key={item._id} value={item._id}>{item.name}</Option>
              })
            }
          </Select>
        </Form.Item>) : ''}
        <Form.Item
          label="分类名称"
          name='categoryName'
          initialValue={row && row.name ? row.name : ''}
          rules={[
            { required: true, message: '请输入分类名称!' }
          ]}>
          <Input placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
Dialog.propTypes = {
  isModalVisible: PropTypes.bool.isRequired
}