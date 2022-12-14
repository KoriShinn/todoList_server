// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
// 导入cors跨域中间件
const cors = require('cors')

const Joi = require('joi')

// 导入用户路由模块
const userRouter = require('./router/user')
const myRouter = require('./router/todo')






// res.cc
app.use(function (req, res, next) {
  res.cc = function (err, status = 1, ...a) {
    const obj = { ...a[0], ...a[1] }
    const hasToken = 'token' in obj
    if (a.length > 0 && hasToken) {
      return res.send(
        {
          data: { ...a[0], ...a[1] },
          // ...a返回的是一个各个数据，传的results[0]本身就是一个大数组，...a[0]就是数组里的每项数据，展开后取key会失去最外层
          meta: {
            msg: err instanceof Error ? err.message : err,
            status,
          }
        }
      )
    } else if (a.length > 0 && !hasToken) {
      return res.send(
        {
          data: { ...a[0] },
          meta: {
            msg: err instanceof Error ? err.message : err,
            status,
          }
        }
      )
    } else {
      return res.send(
        {
          meta: {
            msg: err instanceof Error ? err.message : err,
            status,
          }
        }
      )
    }
  }
  next()
})

// 解析Token
const expresJWT = require('express-jwt')
const config = require('./config')

app.use(expresJWT({ secret: config.jwtSecretKey }).unless({
  path: [/^\/api\//]
}))

// 错误级别中间件
app.use(function (err, req, res, next) {

  if (err instanceof Joi.ValidationError) {
    return res.cc(err)
  }
  if (err.name === 'UnauthorizedError') {
    return res.cc('身份验证失败')
  }
  res.cc(err)
})



// 使用cors中间件
app.use(cors())

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 注册用户路由模块  前缀/api
app.use('/api', userRouter)
// 注册用户路由模块  前缀/my
app.use('/my', myRouter)











app.listen(3007, function () {
  console.log('api server running at http://127.0.0.3007');
})