import React, {Component} from 'react'
import { Card, Form, Input, Cascader, Upload, Button, Select } from 'antd'
import LinkButton from "../../components/linkBtn"
import PicturesWall from './pictures-wall.jxs'
import {ArrowLeftOutlined} from "@ant-design/icons"
import {reqCategorys} from '../../api'
const {Item} = Form
const { TextArea } = Input

export default class AddUpdate extends Component {
  state = {
    options: []
  }
  componentDidMount() {
    this.reqCategorys('0')
  }

  // 返回
  goBack = () => {
    this.props.history.goBack()
  }
  // 确认
  onFinish = (event) => {
    console.log(event)
    console.log(this.pw.getImgs())
  }
  loadData = async (selectedOptions) => {
    // 当前选择的 option 对象
    const targetOption = selectedOptions[0]
    targetOption.loading = true
    // 获取二级分类列表
    const subCategorys = await this.reqCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0) { // 有二级分类
      targetOption.children = subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }))
    } else { // 没有二级分类
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options]
    })
  }
  initOptions = async (categorys) => {
    const options = categorys.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false
    }))
    const {state} = this.props.location
    const { pCategoryId, categoryId } = state || {}
    if (state && pCategoryId !== '0') {
      const subCategorys = await this.reqCategorys(categoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }))
      // 关联到对应的一级options上
      const targetOption = options.find(item => item.value === pCategoryId)
      targetOption.children = childOptions
    }
    this.setState({
      options
    })
  }
  // 获取分类名称
  reqCategorys = async (parentId) => {
    const res = await reqCategorys(parentId)
    if (res.status === 0) {
      if (parentId === '0') {
        this.initOptions(res.data)
      } else {
        return res.data
      }
    }
  }
  render() {
    const {options} = this.state
    const {state} = this.props.location
    const { pCategoryId, categoryId, imgs } = state || {}
    // 级联分类Id数组
    const categoryIds = []
    if (state) {
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const title = (
      <div>
        <LinkButton onClick={this.goBack}>
          <ArrowLeftOutlined style={{fontSize: 15}}/>
        </LinkButton>
        <span style={{marginLeft: 5}}>{state ? '修改商品' : '添加商品'}</span>
      </div>
    )
    const layout = {
      labelCol: { span: 1.5 },
      wrapperCol: { span: 8 }
    }
    return (
      <Card title={title}>
        <Form {...layout} onFinish={this.onFinish}>
          <Form.Item
            name="name"
            initialValue={state && state.name ? state.name : ''}
            label="商品名称"
            rules={[
              { required: true, message: '请输入商品名称!' }
            ]}>
            <Input placeholder='请输入商品名称'/>
          </Form.Item>
          <Form.Item
            name="desc"
            initialValue={state && state.desc ? state.desc : ''}
            label="商品描述"
            rules={[
              { required: true, message: '请输入商品描述!' },
            ]}>
            <TextArea showCount maxLength={100} placeholder='请输入商品描述' rows={3} />
          </Form.Item>
          <Form.Item
            name="price"
            initialValue={state && state.price ? state.price : ''}
            label="商品价格"
            rules={[
              { required: true, message: '请输入商品价格!' },
              ({ getFieldValue }) => ({
                validator(_, value, callback) {
                  if (!value || value * 1 > 0) {
                    callback()
                  } else {
                    callback('价格必须大于0')
                  }
                }
              })
            ]}>
            <Input placeholder='请输入商品价格' type='number' addonAfter="元" />
          </Form.Item>
          <Form.Item
            name="categoryIds"
            initialValue={categoryIds}
            label="商品分类"
            rules={[
              { required: true, message: '请选择商品分类!' }
            ]}>
            <Cascader
              placeholder='请选择商品分类'
              options={options}
              loadData={this.loadData} />
          </Form.Item>
          <Form.Item label="商品图片">
            <PicturesWall ref={c => this.pw = c} imgs={imgs}/>
          </Form.Item>
          <Form.Item
            name="note"
            label="商品详情"
            rules={[{ required: true }]}>
            <Input placeholder='请输入商品价格' type='number' addonAfter="元" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}