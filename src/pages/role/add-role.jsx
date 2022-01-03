import React from 'react'
import {Modal, Form, Input, message} from 'antd'
import PropTypes from 'prop-types'
import { reqAddRole } from '../../api'

export default function Dialog(props) {
  const [form] = Form.useForm()
  const {isAddModalVisible, changeAddVisible, getRoles} = props
  // 确定
  const handleOk = () => {
    form.validateFields().then(async values => {
      const res = await reqAddRole(values.roleName)
      if (res.status === 0) {
        message.success('添加角色成功')
        changeAddVisible(false)
        form.resetFields()
        getRoles()
      } else {
        message.error('添加角色失败')
      }
    }).catch(err => {
      return false
    })
  }
  // 取消
  const handleCancel = () => {
    form.resetFields()
    changeAddVisible(false)
  }
  return (
    <Modal
      title='添加角色'
      visible={ isAddModalVisible }
      cancelText='取消'
      okText='确定'
      maskClosable={false}
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form form={form}>
        <Form.Item
          label="角色名称"
          name='roleName'
          rules={[
            { required: true, message: '请输入角色名称!' }
          ]}>
          <Input placeholder="请输入角色名称" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
Dialog.propTypes = {
  isAddModalVisible: PropTypes.bool.isRequired
}