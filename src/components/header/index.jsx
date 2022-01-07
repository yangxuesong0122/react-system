import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import LinkButton from '../linkBtn'
import { formateDate } from '../../utils/dateUtils'
import './index.less'
import {logOut} from '../../redux/actions'

// 头部组件
class Header extends Component {
  state = {
    currentTime: formateDate(Date.now())
  }
  componentDidMount () {
    // 获取当前的时间
    this.getTime()
  }
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }
  // 获取时间
  getTime = () => {
    // 每隔1s获取当前时间, 并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }
  // 获取当前路由名称
  // getRouteTitle = () => {
  //   // 获取当前请求路径
  //   const path = this.props.location.pathname
  //   let title = ''
  //   menuList.forEach(item => {
  //     if (item.key === path) {
  //       title = item.title
  //     } else if (item.children && item.children.length) {
  //       const node = item.children.find(cItem => path.indexOf(cItem.key) === 0)
  //       if (node && node.title) {
  //         title = node.title
  //       }
  //     }
  //   })
  //   return title
  // }
  // 退出登录
  handleLogout = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: '您确定要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.logOut()
        // 跳转到登录页面
        // this.props.history.replace('/login')
      }
    })
  }
  render() {
    const { currentTime } = this.state
    const {title, user} = this.props
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{user.username}</span>
          {/*<a onClick={this.handleLogout}>退出</a>*/}
          <LinkButton onClick={this.handleLogout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            {/*{this.getRouteTitle()}*/}
            {title}
          </div>
          <div className='header-bottom-right'>
            <span style={{marginRight: 5}}>{currentTime}</span>
            {/*<img/>*/}
            <span>晴</span>
          </div>
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({title: state.headTitle, user: state.user}),
  {logOut}
)(withRouter(Header))