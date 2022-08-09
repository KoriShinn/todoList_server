const mysql = require('mysql')

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'kexin666',
  database: 'my_todoList_01'
})



// 向外共享数据库
module.exports = db