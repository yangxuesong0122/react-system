import React, {Component} from 'react'
import {Card, Select, Table, message, Input, Button} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import LinkButton from '../../components/linkBtn'
import {PAGE_SIZE} from '../../utils/constants'

const {Option} = Select

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.initColumns()
  }
  state = {
    loading: false,
    productList: [],
    total: 0,
    pageNum: '',
    searchKey: '',
    searchType: 'productName'
  }
  componentDidMount() {
    this.getProductList(1)
  }

  // 初始化table 所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: price => '￥' + price
      },
      {
        title: '状态',
        width: 100,
        // dataIndex: 'status',
        render: row => {
          const { status, _id } = row
          const newStatus = status === 1 ? 2 : 1
          return (
            <div>
              <Button onClick={() => this.handleUpOrDown(_id, newStatus)} type='primary'>{status === 1 ? '下架' : '上架'}</Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (row) => (
          <div>
            <LinkButton onClick={() => this.props.history.push('/product/detail', { row })}>详情</LinkButton>
            <LinkButton onClick={() => this.addOrUpdateProd(row)}>修改</LinkButton>
          </div>
        )
      }
    ]
  }
  // 获取商品分页列表
  getProductList = async(pageNum) => {
    this.pageNum = pageNum
    this.setState({
      loading: true
    })
    const {searchKey, searchType} = this.state
    // 如果搜索关键字有值, 搜索分页
    let res
    if (searchKey) {
      const params = {
        pageNum,
        pageSize: PAGE_SIZE,
        searchName: searchKey,
        searchType
      }
      res = await reqSearchProducts(params)
    } else { // 一般分页请求
      res = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({
      loading: false
    })
    if (res.status === 0) {
      const { total, list } = res.data
      this.setState({
        total,
        productList: list
      })
    } else {}
  }
  // 搜索
  // handleSearch = async () => {
  //   const { searchKey, searchType, pageNum } = this.state
  //   const params = {
  //     pageNum,
  //     pageSize: PAGE_SIZE,
  //     searchName: searchKey,
  //     searchType
  //   }
  //   const res = await reqSearchProducts(params)
  //   if (res.status === 0) {
  //     const { total, list } = res.data
  //     this.setState({
  //       total,
  //       productList: list
  //     })
  //   }
  // }
  // 输入框回调
  handleInputChange = (e) => {
    this.setState({
      searchKey: e.target.value
    })
  }
  // 选择框回调
  handleSelectChange = (e) => {
    this.setState({
      searchType: e
    })
  }
  // 分页回调
  // handlePage = (pageNum, pageSize) => {
  //   this.setState({
  //     pageNum
  //   })
  // }
  // 上/下架
  handleUpOrDown = async (id, status) => {
    const result = await reqUpdateStatus(id, status)
    if(result.status === 0) {
      message.success('更新商品成功')
      this.getProductList(this.pageNum)
    }
  }
  // 添加、修改商品
  addOrUpdateProd = (row = null) => {
    this.props.history.push('/product/addUpdate', row)
  }
  render() {
    const { loading, productList, total, searchType } = this.state
    const title = (
      <span>
        <Select value={searchType} onChange={this.handleSelectChange} style={{width: 150}}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input onChange={this.handleInputChange} placeholder='关键字' style={{width: 150, margin: '0 15px'}} />
        {/*<Button onClick={this.handleSearch} type='primary'>搜索</Button>*/}
        <Button onClick={() => this.getProductList(1)} type='primary'>搜索</Button>
      </span>
    )
    const btn = (
      <Button onClick={() => this.addOrUpdateProd()} type="primary" icon={<PlusOutlined />}>
        添加商品
      </Button>
    )
    return (
      <Card size="small" title={title} extra={btn} style={{ width: '100%', height: '100%' }}>
        <Table
          dataSource={productList}
          columns={this.columns}
          bordered
          rowKey='_id'
          loading={loading}
          // onChange={this.handlePage}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            // onChange: (pageNum) => {
            //   this.getProductList(pageNum)
            // }
            onChange: this.getProductList
          }}/>
      </Card>
    )
  }
}