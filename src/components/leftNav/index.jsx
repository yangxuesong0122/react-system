import React, {Component} from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'
import {
  AppstoreOutlined,
  LayoutOutlined,
  MacCommandOutlined
} from '@ant-design/icons'
import menuList from '../../config/menuConfig'

import logo from '../../assets/images/logo.jpg'
import './index.less'

const { SubMenu } = Menu

// 左侧导航组件
class LeftNav extends Component {
  constructor(props) {
    super(props)
    // 初始化获取菜单数据
    this.menuNodes = this.getMenuNodes(menuList)
  }
  // 生成menu标签数组(map版本)
  getMenuNodes_map = (menuList) => {
    return menuList.map(item => {
      if (item.children && item.children.length) {
        return (
          <SubMenu key={item.key} icon={<LayoutOutlined />} title={item.title}>
            { this.getMenuNodes(item.children) }
          </SubMenu>
        )
      } else {
        return (
          <Menu.Item key={item.key} icon={<AppstoreOutlined />}>
            <Link to={item.key}>
              {item.title}
            </Link>
          </Menu.Item>
        )
      }
    })
  }
  // 生成menu标签数组(reduce版本)
  getMenuNodes = (menuList) => {
    return menuList.reduce((pre, current) => {
      if (current.children && current.children.length) {
        // 获取当前请求的路由路径
        const currentPath = this.props.location.pathname
        // 查找与当前请求路径匹配的子item
        const cItem = current.children.find(item => item.key === currentPath)
        // 如果存在，要展开当前列表
        if (cItem && cItem.key) {
          this.openKey = current.key
        }
        pre.push((
          <SubMenu key={current.key} icon={<LayoutOutlined />} title={current.title}>
            { this.getMenuNodes(current.children) }
          </SubMenu>
        ))
      } else {
        pre.push((
          <Menu.Item key={current.key} icon={<AppstoreOutlined />}>
            <Link to={current.key}>
              {current.title}
            </Link>
          </Menu.Item>
        ))
      }
      return pre
    }, [])
  }

  render() {
    // 获取当前请求的路由路径
    // const { currentPath } = this.props
    const currentPath = this.props.location.pathname
    return (
      <div className='left-nav'>
        {/*顶部标题*/}
        <Link to='/' className='left-nav-top'>
          <img src={logo} alt='logo' />
          <div>雪松后台</div>
        </Link>
        {/*菜单*/}
        <Menu
          selectedKeys={[currentPath]}
          defaultOpenKeys={[this.openKey]}
          mode="inline"
          theme="dark">
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}
// 包装非路由组件，返回新组件
export default withRouter(LeftNav)