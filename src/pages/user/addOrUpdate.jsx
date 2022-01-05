import React from 'react'
import {Modal, Form, Input, Select, message} from 'antd'
import {reqAddOrUpdateUser} from "../../api"
const {Option} = Select

export default function AddOrUpdate(props) {
  const [form] = Form.useForm()
  let {dialogVisible, user, roleList} = props
  if (!user) {
    user = {}
  }
  console.log(user.username)
  // 确定
  const handleOk = () => {
    form.validateFields().then(async values => {
      if (user._id) { // 更新
        values._id = user._id
      }
      const res = await reqAddOrUpdateUser(values)
      if (res.status === 0) {
        form.resetFields()
        props.closeDialog()
        props.getUserList()
        message.success(`${user._id ? '修改' : '添加'}用户成功`)
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
    props.closeDialog(false)
  }
  // 选择框回调
  const handleSelectChange = () => {

  }
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }
  return (
    <Modal
      title={ user._id ? '修改用户' : '添加用户' }
      visible={ dialogVisible }
      cancelText='取消'
      okText='确定'
      destroyOnClose={true}
      maskClosable={false}
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form form={form} {...formItemLayout} preserve={false}>
        <Form.Item
          label="用户名"
          name='username'
          initialValue={user.username}
          rules={[
            { required: true, message: '请输入用户名!' }
          ]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {
          user._id ? '' : (<Form.Item
            label="密码"
            name='password'
            initialValue={user.password}
            rules={[
              { required: true, message: '请输入密码!' }
            ]}>
            <Input type='password' placeholder="请输入密码" />
          </Form.Item>)
        }
        <Form.Item
          label="手机号"
          name='phone'
          initialValue={user.phone}
          rules={[
            { required: true, message: '请输入手机号!' }
          ]}>
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name='email'
          initialValue={user.email}
          rules={[
            { required: true, message: '请输入邮箱!' }
          ]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          label="角色"
          name='role_id'
          initialValue={user.role_id}
          rules={[
            { required: true, message: '请选择角色!' }
          ]}>
          <Select
            placeholder="请选择角色"
            onChange={handleSelectChange}
            allowClear>
            {
              roleList.map(item => {
                return <Option key={item._id} value={item._id}>{item.name}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}