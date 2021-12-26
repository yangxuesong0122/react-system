import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import { Layout } from 'antd'
import LeftNav from '../../components/leftNav'
import HeaderTop from '../../components/header'

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
          <Content style={{backgroundColor: '#000'}}>Content</Content>
          <Footer style={{ textAlign: 'center', color: '#ccc' }}>React 练手项目</Footer>
        </Layout>
      </Layout>
    )
  }
}