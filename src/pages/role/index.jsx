import React, {Component} from 'react'
import {Card, Button, Table} from 'antd'
import dayjs from 'dayjs'
import {reqRoles} from '../../api'
import LinkButton from "../../components/linkBtn"
import {PAGE_SIZE} from '../../utils/constants'
import AddRole from './add-role'

export default class Role extends Component {
  constructor(props) {
    super(props)
    this.initColumns()
  }

  state = {
    roles: [],
    isAddModalVisible: false,
    role: {} // 选中的 role
  }

  componentDidMount() {
    this.getRoles()
  }

  // 初始化table 所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => (
          dayjs(create_time).format('YYYY-MM-DD HH:mm:ss')
        )
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time'
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  }
  // 获取所有角色列表
  getRoles = async () => {
    const res = await reqRoles()
    if (res.status === 0) {
      this.setState({
        roles: res.data
      })
    }
  }
  onRow = (row) => {
    return {
      onClick: event => { // 点击行
        this.setState({
          role: row
        })
      }
    }
  }
  // 添加角色
  addRole = () => {
    this.setState({
      isAddModalVisible: true
    })
  }
  // 关闭添加角色弹框
  changeAddVisible = () => {
    this.setState({
      isAddModalVisible: false
    })
  }

  render() {
    const {roles, role, isAddModalVisible} = this.state
    const title = (
      <div>
        <Button type='primary' onClick={() => this.addRole()} style={{marginRight: 10}}>创建角色</Button>
        <Button type='primary' disabled={!role._id}>设置角色权限</Button>
      </div>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          rowSelection={{type: 'radio', selectedRowKeys: [role._id]}}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          onRow={this.onRow}/>
        <AddRole
          isAddModalVisible={isAddModalVisible}
          getRoles={this.getRoles}
          changeAddVisible={this.changeAddVisible}/>
      </Card>
    )
  }
}