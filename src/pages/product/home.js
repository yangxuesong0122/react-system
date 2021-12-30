import React, {Component} from 'react'
import {Card, Select, Table, message, Input, Button} from 'antd'
import {ArrowRightOutlined, PlusOutlined} from '@ant-design/icons'
import { reqProducts } from '../../api'
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
    total: 0
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
        dataIndex: 'status',
        render: status => {
          return (
            <div>
              <Button type='primary'>下架</Button>
              <span>在售</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (row) => (
          <div>
            <LinkButton onClick={() => this.openDialog(row)}>详情</LinkButton>
            <LinkButton onClick={() => this.openDialog(row)}>修改</LinkButton>
          </div>
        )
      }
    ]
  }
  // 获取商品分页列表
  getProductList = async(pageNum) => {
    this.setState({
      loading: true
    })
    const res = await reqProducts(pageNum, PAGE_SIZE)
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
  render() {
    const { loading, productList, total } = this.state
    const title = (
      <span>
        <Select value='1' style={{width: 150}}>
          <Option value='1'>按名称搜索</Option>
          <Option value='2'>按描述搜索</Option>
        </Select>
        <Input placeholder='关键字' style={{width: 150, margin: '0 15px'}} />
        <Button type='primary'>搜索</Button>
      </span>
    )
    const btn = (
      <Button onClick={() => this.openDialog()} type="primary" icon={<PlusOutlined />}>
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
          pagination={{
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