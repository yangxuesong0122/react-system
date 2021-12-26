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
          defaultSelectedKeys={['/home']}
          /*defaultOpenKeys={['sub1']}*/
          mode="inline"
          theme="dark">
          <Menu.Item key="/home" icon={<AppstoreOutlined />}>
            <Link to='/home'>
              首页
            </Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<LayoutOutlined />} title="商品">
            <Menu.Item key="/category" icon={<PieChartOutlined />}>
              <Link to='/category'>
                品类管理
              </Link>
            </Menu.Item>
            <Menu.Item key="/product" icon={<MacCommandOutlined />}>
              <Link to='/product'>
                商品管理
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="/user" icon={<AppstoreOutlined />}>
            <Link to='/user'>
              用户管理
            </Link>
          </Menu.Item>
          <Menu.Item key="/role" icon={<AppstoreOutlined />}>
            <Link to='/role'>
              角色管理
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}