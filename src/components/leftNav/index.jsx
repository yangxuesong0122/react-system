import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import {
  AppstoreOutlined,
  PieChartOutlined,
  LayoutOutlined,
  MacCommandOutlined
} from '@ant-design/icons'

import logo from '../../assets/images/logo.jpg'
import './index.less'

const { SubMenu } = Menu

// 左侧导航组件
export default class LeftNav extends Component {
  render() {
    return (
      <div className='left-nav'>
        {/*顶部标题*/}
        <Link to='/' className='left-nav-top'>
          <img src={logo} alt='logo' />
          <div>雪松后台</div>
        </Link>
        {/*菜单*/}
        <Menu
          /*defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}*/
          mode="inline"
          theme="dark">
          <Menu.Item key="1" icon={<AppstoreOutlined />}>
            首页
          </Menu.Item>
          <SubMenu key="sub1" icon={<LayoutOutlined />} title="商品">
            <Menu.Item key="5" icon={<PieChartOutlined />}>品类管理</Menu.Item>
            <Menu.Item key="6" icon={<MacCommandOutlined />}>商品管理</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}