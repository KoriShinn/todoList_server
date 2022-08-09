const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

// userHandle函数模块
const userHandle = require('../router_handle/user')
const { reg_login_schema } = require('../schema/user')


// 注册新用户
router.post('/reguser', expressJoi(reg_login_schema), userHandle.regUser,)
// 登录
router.post('/login', expressJoi(reg_login_schema), userHandle.login)






// 将路由对象共享出去
module.exports = router