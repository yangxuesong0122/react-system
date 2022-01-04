import React, {Component} from 'react'
import {Modal, Form, Input, message, Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memory'
import storage from '../../utils/storage'
import { reqUpdateRole } from '../../api'

export default class Dialog extends Component {
  constructor(props) {
    super(props)
    this.treeData = [
      {
        title: '平台权限',
        key: 'all',
        children: [...menuList]
      }
    ]
  }
  static propTypes = {
    isSetModalVisible: PropTypes.bool.isRequired
  }
  state = {
    checkedKeys: []
  }

  // 确定
  handleOk = async () => {
    const {checkedKeys} = this.state
    const {role, getRoles} = this.props
    role.menus = checkedKeys
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    // 请求更新
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      // 如果当前更新的是自己角色的权限, 强制退出
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {}
        storage.removeUser()
        this.props.history.replace('/login')
        message.success('当前用户角色权限成功')
      } else {
        message.success('设置角色权限成功')
        getRoles()
      }
      this.props.changeSetVisible(false)
    }
  }
  // 取消
  handleCancel = () => {
    this.props.changeSetVisible(false)
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info)
  }
  // 树控件选择回调
  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys
    })
  }
  render() {
    const {isSetModalVisible, role} = this.props
    const checkedKeys = role.menus
    return (
      <Modal
        title='设置角色权限'
        visible={ isSetModalVisible }
        cancelText='取消'
        okText='确定'
        maskClosable={false}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <Form.Item label="角色名称">
          <Input value={role.name} disabled />
        </Form.Item>
        <Tree
          checkable
          defaultExpandAll /*默认展开所有树节点*/
          checkedKeys={checkedKeys}
          treeData={this.treeData}
          onSelect={this.onSelect}
          onCheck={this.onCheck} />
      </Modal>
    )
  }
}