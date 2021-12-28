import React, {Component} from 'react'
import {Card, Button, Table, message} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../components/linkBtn'
import { reqCategorys } from '../../api'
import './index.less'

export default class Category extends Component {
  constructor(props) {
    super(props)
    this.initColumns()
  }
  state = {
    categoryList: [], // 一级分类列表
    loading: false
  }
  componentDidMount() {
    this.getCategoryList()
  }

  // 初始化table 所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: () => (
            <span>
            <LinkButton>修改分类</LinkButton>
            <LinkButton>查看子分类</LinkButton>
          </span>
        )
      }
    ]
  }
  // 获取分类数据
  getCategoryList = async() => {
    this.setState({
      loading: true
    })
    const res = await reqCategorys('0')
    this.setState({
      loading: false
    })
    if (res.status === 0) {
      this.setState({
        categoryList: res.data
      })
    } else {
      message.error('获取分类列表失败')
    }
  }
  render() {
    const {categoryList, loading} = this.state
    const title = '一级分类列表'
    const btn = (
      <Button type="primary" icon={<PlusOutlined />}>
        添加
      </Button>
    )
    return (
      <Card size="small" title={title} extra={btn} style={{ width: '100%', height: '100%' }}>
        <Table
          dataSource={categoryList}
          columns={this.columns}
          bordered
          rowKey='_id'
          loading={loading}
          pagination={{
            defaultPageSize: 5,
            showQuickJumper: true
          }}/>
      </Card>
    )
  }
}