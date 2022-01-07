import {SET_HEAD_TITLE, SET_USER, SHOW_ERROR_MEG, RESET_USER} from './action-types'
import { message } from 'antd'
import { reqLogin } from  '../api'
import storage from "../utils/storage"

// 设置头部标题的同步action
export const setHeadTitle = title => ({type: SET_HEAD_TITLE, data: title})
// 保存用户信息的同步action
export const setUser = user => ({type: SET_USER, data: user})
// 显示错误信息的同步action
export const showErrorMeg = errMsg => ({type: SHOW_ERROR_MEG, data: errMsg})
// 退出登录的同步action
export const logOut = () => {
  // 删除local中的user
  storage.removeUser()
  return {type: RESET_USER}
}

// 登录的异步action
export const login = loginInfo => {
  return async (dispatch) => {
    const {username, password} = loginInfo
    const res = await reqLogin(username, password)
    if (res.status === 0) { // 登录成功
      message.success('登录成功')
      const user = res.data
      // 保存到local中
      storage.saveUser(user)
      dispatch(setUser(user))
    } else {
      // message.error(res.msg)
      dispatch(showErrorMeg(res.msg))
    }
  }
}