import React, {Component} from 'react'
import {Card, List} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/linkBtn'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'
const {Item} = List

export default class Detail extends Component {
  state = {
    cNameOne: '', // 一级分类名称
    cNameTwo: '' // 二级分类名称
  }
  componentDidMount() {
    this.reqCategory()
  }
  // 获取分类名称
  reqCategory = async () => {
    const { pCategoryId, categoryId } = this.props.location.state.row
    if (pCategoryId === '0') { // 一级分类商品
      const res = await reqCategory(categoryId)
      this.setState({
        cNameOne: res.data.name
      })
    } else {
      // const res1 = await reqCategory(pCategoryId)
      // const res2 = await reqCategory(categoryId)
      const res = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      this.setState({
        cNameOne: res[0].data.name,
        cNameTwo: res[1].data.name
      })
    }
  }

  // 返回
  goBack = () => {
    this.props.history.goBack()
  }
  render() {
    const { row } = this.props.location.state || {}
    const { cNameOne, cNameTwo } = this.state
    const title = (
      <div>
        <LinkButton onClick={this.goBack}>
          <ArrowLeftOutlined style={{fontSize: 15}}/>
        </LinkButton>
        <span style={{marginLeft: 5}}>商品详情</span>
      </div>
    )
    return (
      <Card size="small" title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left-title'>商品名称: </span>
            <span>{row.name}</span>
          </Item>
          <Item>
            <span className='left-title'>商品描述: </span>
            <span>{row.desc}</span>
          </Item>
          <Item>
            <span className='left-title'>商品价格: </span>
            <span>{row.price}元</span>
          </Item>
          <Item>
            <span className='left-title'>所属分类: </span>
            <span>{cNameOne} {cNameTwo ? `-- > ${cNameTwo}` : ''}</span>
          </Item>
          <Item>
            <span className='left-title'>商品图片: </span>
            <span>
              {
                row.imgs.map(img => (
                  <img key={img} src={BASE_IMG_URL + img} alt='img'/>
                ))
              }
            </span>
          </Item>
          <Item>
            <span className='left-title'>商品详情: </span>
            <span dangerouslySetInnerHTML={{__html: row.detail}} />
          </Item>
        </List>
      </Card>
    )
  }
}