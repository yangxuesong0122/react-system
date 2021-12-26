import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import memory from './utils/memory'
import storage from './utils/storage'

// 读取local中保存的user，保存到内存中
memory.user = storage.getUser()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
