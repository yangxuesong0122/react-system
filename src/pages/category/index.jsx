import React, {Component} from 'react'
import {Card, Button, Table, message, Modal} from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import Dialog from './components/dialog'
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
    subCategoryList: [], // 子分类列表
    loading: false,
    parentId: '0', // 当前需要显示的分类列表的id
    parentName: '', // 当前需要显示的分类列表的父分类名称
    showStatus: 0, // 添加/更新确认框是否显示
    dialogTitle: '添加分类',
    isModalVisible: false
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
        render: (row) => (
          <span>
            <LinkButton onClick={() => this.openDialog(row)}>修改分类</LinkButton>
            { this.state.parentId === '0' ? <LinkButton onClick={ () => this.showSubCategorys(row)}>查看子分类</LinkButton> : '' }
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
    const {parentId} = this.state
    const res = await reqCategorys(parentId)
    this.setState({
      loading: false
    })
    if (res.status === 0) {
      if (parentId === '0') {
        this.setState({
          categoryList: res.data
        })
      } else {
        this.setState({
          subCategoryList: res.data
        })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }
  // 获取子分类数据
  showSubCategorys = (row) => {
    // setState 不能立即获取最新的状态，因为是一部更新状态的
    this.setState({
      parentId: row._id,
      parentName: row.name
    }, () => {
      this.getCategoryList()
    })
  }
  // 回到一级分类列表
  toParentList = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategoryList: []
    })
  }
  // 打开弹框
  openDialog = (row = null) => {
    this.row = row
    if (!row) {
      this.setState({
        showStatus: 1, // 1 添加   2 更新
        isModalVisible: true
      })
    } else {
      this.setState({
        showStatus: 2, // 1 添加   2 更新
        isModalVisible: true
      })
    }
  }
  // 传给子组件的方法，是否打开弹框
  changeVisible = (val) => {
    this.setState({
      isModalVisible: val
    })
  }
  render() {
    const row = this.row || {}
    const {categoryList, loading, subCategoryList, parentId, parentName, showStatus, isModalVisible} = this.state
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.toParentList}>一级分类列表</LinkButton>
        <ArrowRightOutlined />
        <span>{parentName}</span>
      </span>
    )
    const btn = (
      <Button onClick={() => this.openDialog()} type="primary" icon={<PlusOutlined />}>
        添加
      </Button>
    )
    return (
      <Card size="small" title={title} extra={btn} style={{ width: '100%', height: '100%' }}>
        <Table
          dataSource={ parentId === '0' ? categoryList : subCategoryList}
          columns={this.columns}
          bordered
          rowKey='_id'
          loading={loading}
          pagination={{
            defaultPageSize: 5,
            showQuickJumper: true
          }}/>
        {/*添加/修改分类*/}
        <Dialog
          row={row}
          categoryList={categoryList}
          parentId={parentId}
          isModalVisible={isModalVisible}
          showStatus={showStatus}
          changeVisible={this.changeVisible}
          getCategoryList={this.getCategoryList}/>
      </Card>
    )
  }
}