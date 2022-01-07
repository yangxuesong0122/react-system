import React, {Component} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import {connect} from 'react-redux'
import LeftNav from '../../components/leftNav'
import HeaderTop from '../../components/header'
import Home from '../home'
import Category from '../category'
import Product from '../product'
import User from '../user'
import Role from '../role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import './index.less'

const { Footer, Sider, Content } = Layout

class Admin extends Component {
  render() {
    // // 获取当前请求的路由路径
    // const currentPath = this.props.location.pathname
    // 如果内存没有存储user ==> 当前没有登录
    const user = this.props.user
    if (!user || !user.username) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{height: '100%'}}>
        <Sider>
          {/*<LeftNav currentPath={currentPath}/>*/}
          <LeftNav />
        </Sider>
        <Layout>
          <HeaderTop/>
          <Content className='content'>
            <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/user' component={User}/>
              <Route path='/role' component={Role}/>
              <Route path="/charts/bar" component={Bar}/>
              <Route path="/charts/pie" component={Pie}/>
              <Route path="/charts/line" component={Line}/>
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#ccc' }}>React 练手项目</Footer>
        </Layout>
      </Layout>
    )
  }
}
export default connect(
  state => ({user: state.user}),
  {}
)(Admin)