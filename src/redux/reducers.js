import {combineReducers} from 'redux'
import storage from '../utils/storage'
import {SET_HEAD_TITLE, SET_USER, SHOW_ERROR_MEG, RESET_USER} from './action-types'

// 用来管理头部标题的reducer函数
const initHeadTitle = '首页'
function headTitle(state = initHeadTitle, action) {
  const {type, data} = action
  switch (type) {
    case SET_HEAD_TITLE:
      return data
    default:
      return state
  }
}

// 用来管理当前登录用户的reducer函数
const initUser = storage.getUser()
function user(state = initUser, action) {
  const {type, data} = action
  switch (type) {
    case SET_USER:
      return data
    case SHOW_ERROR_MEG:
      // state.errMsg = data  // 不要直接修改原本状态数据
      return {...state, errMsg: data}
    case RESET_USER:
      return {}
    default:
      return state
  }
}

export default combineReducers({
  headTitle,
  user
})