import React, {Component} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
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

import memory from '../../utils/memory'
const { Footer, Sider, Content } = Layout

export default class Admin extends Component {
  render() {
    // 如果内存没有存储user ==> 当前没有登录
    if (!memory.user.username) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{height: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <HeaderTop/>
          <Content style={{backgroundColor: '#fff'}}>
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