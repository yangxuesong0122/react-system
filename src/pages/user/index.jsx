import React, {Component} from 'react'
import {Card, Button, Table, message, Modal} from 'antd'
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons"
import LinkButton from "../../components/linkBtn"
import dayjs from "dayjs"
import {PAGE_SIZE} from "../../utils/constants"
import {reqUsers, reqDeleteUser} from "../../api"
import AddOrUpdate from "./addOrUpdate"

export default class User extends Component {
  constructor(props) {
    super(props)
    this.initColumns()
  }
  state = {
    userList: [],
    roleList: [],
    loading: false,
    dialogVisible: false
  }
  componentDidMount() {
    this.getUserList()
  }
  // 获取用户列表
  getUserList = async () => {
    const res = await reqUsers()
    if (res.status === 0) {
      const {users, roles} = res.data
      // 生成： 角色id：角色名 的对象数组
      this.initRoleNames(roles)
      this.setState({
        userList: users,
        roleList: roles
      })
    }
  }

  // 初始化table 所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => (
          dayjs(create_time).format('YYYY-MM-DD HH:mm:ss')
        )
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => {
          return this.roleNames[role_id]
          // const {roleList} = this.state
          // const role = roleList.find(item => item._id === role_id)
          // return role.name
        }
      },
      {
        title: '操作',
        width: 150,
        render: (row) => (
          <span>
            <LinkButton onClick={() => this.handleOpenDialog(row)}>修改</LinkButton>
            <LinkButton onClick={() => this.handleDel(row)}>删除</LinkButton>
          </span>
        )
      }
    ]
  }
  // 根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存
    this.roleNames = roleNames
  }
  // 删除用户
  handleDel = user => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: `您确定要删除${user.username}吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await reqDeleteUser(user._id)
        if (res.status === 0) {
          message.success('删除用户成功')
          this.getUserList()
        }
      }
    })
  }
  // 添加、修改用户
  handleOpenDialog = (user = null) => {
    this.user = user
    this.setState({
      dialogVisible: true
    })
  }
  // 关闭弹框
  closeDialog = () => {
    this.setState({
      dialogVisible: false
    })
  }
  render() {
    const btn = (
      <Button onClick={() => this.handleOpenDialog()} type="primary" icon={<PlusOutlined />}>
        创建用户
      </Button>
    )
    const {userList, loading, dialogVisible, roleList} = this.state
    return (
      <Card title={btn}>
        <Table
          dataSource={ userList }
          columns={this.columns}
          bordered
          rowKey='_id'
          loading={loading}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true
          }}/>
        {/*添加/修改用户*/}
        <AddOrUpdate
          user={this.user}
          roleList={roleList}
          dialogVisible={dialogVisible}
          closeDialog={this.closeDialog}
          getUserList={this.getUserList}
          />
      </Card>
    )
  }
}