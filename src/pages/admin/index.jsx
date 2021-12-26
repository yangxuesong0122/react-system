import React, {Component} from 'react'
import memory from '../../utils/memory'
import { Redirect } from 'react-router-dom'

export default class Admin extends Component {
  render() {
    // 如果内存没有存储user ==> 当前没有登录
    if (!memory.user.username) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to='/login'/>
    }
    return (
      <div>
        用户名是：{memory.user.username}
      </div>
    )
  }
}