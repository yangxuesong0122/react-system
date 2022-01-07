import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'
import {
  AppstoreOutlined,
  LayoutOutlined
} from '@ant-design/icons'
import {setHeadTitle} from '../../redux/actions'
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
    // 获取当前请求的路由路径
    const currentPath = this.props.location.pathname
    return menuList.reduce((pre, current) => {
      if (this.haseAuth(current)) {
        if (current.children && current.children.length) {
          // 查找与当前请求路径匹配的子item
          const cItem = current.children.find(item => currentPath.indexOf(item.key) === 0)
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
          if (current.key === currentPath || currentPath.indexOf(current.key) === 0) {
            this.props.setHeadTitle(current.title)
          }
          pre.push((
            <Menu.Item key={current.key} icon={<AppstoreOutlined />}>
              <Link to={current.key} onClick={() => this.setHeadTitle(current.title)}>
                {current.title}
              </Link>
            </Menu.Item>
          ))
        }
      }
      return pre
    }, [])
  }

  // 存储头部标题
  setHeadTitle = (title) => {
    this.props.setHeadTitle(title)
  }
  // 判断是否有权限
  haseAuth = (item) => {
    const key = item.key
    const user = this.props.user
    const username = user.username
    const menus = user.role.menus
    // 当前用户是 admin，不用判断，直接通过
    if (username === 'admin' || item.isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) {
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }

  render() {
    // 获取当前请求的路由路径
    // const { currentPath } = this.props
    let currentPath = this.props.location.pathname
    if (currentPath.indexOf('/product') === 0) {
      currentPath = '/product'
    }
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
export default connect(
  state => ({user: state.user}),
  // dispatch => ({
  //   setHeadTitle: (data) => {
  //     dispatch(setHeadTitle(data))
  //   }
  // })
  {
    setHeadTitle
  }
)(withRouter(LeftNav))