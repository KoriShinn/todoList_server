const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
exports.regUser = (req, res) => {

  const userinfo = req.body
  if (!userinfo.username || !userinfo.password) {
    return res.cc('用户名密码不能为空')
  }
  const sqlStr = 'select * from todoList_users where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length > 0) {
      return res.cc('用户名已存在')
    }
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    const sql = 'insert into todoList_users set ?'
    db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.affectedRows !== 1) {
        return res.cc('注册失败，稍后再试')
      }
      res.cc('注册成功', 0)
    })


  })


}

exports.login = (req, res) => {
  const userinfo = req.body
  const sqlStr = 'select * from todoList_users where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return res.cc('登陆失败')
    }
    const comparePassword = bcrypt.compareSync(userinfo.password, results[0].password)
    if (!comparePassword) {
      return res.cc('密码错误')
    }
    const user = { ...results[0], password: '' }
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' })
    const { password, ...userDate } = results[0]
    const token = { token: 'Bearer ' + tokenStr }
    res.cc('登录成功', 0, userDate, token)
  })
}