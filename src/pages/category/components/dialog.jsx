import React, {Component} from 'react'
import {Modal, Form, Input, Select} from 'antd'
import { reqAddCategory, reqUpdateCategory } from '../../../api/index'

const {Option} = Select

export default function Dialog(props) {
  const [form] = Form.useForm()
  const {showStatus, isModalVisible} = props
  // 确定
  const handleOk = () => {
    form.validateFields().then(values => {
      console.log(values)
      props.changeVisible(false)
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
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form form={form}>
        <Form.Item
          label="所属分类"
          name='parentId'
          rules={[
            { required: true, message: '请选择所属分类!' }
          ]}>
          <Select
            placeholder="请选择分类"
            onChange={handleSelectChange}
            allowClear>
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="分类名称"
          name='categoryName'
          rules={[
            { required: true, message: '请输入分类名称!' }
          ]}>
          <Input placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    </Modal>
  )
}