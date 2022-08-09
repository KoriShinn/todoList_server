const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')


const todoHandle = require('../router_handle/todo')
const { add_todo_schema } = require('../schema/todo')

// 获取
router.get('/todo', todoHandle.getTodoList)
// 新增
router.post('/todo', todoHandle.setNewTodo)
// 更新
router.put('/todo/:id', todoHandle.updateTodo)
// 完成
router.put('/todo/list/:id', todoHandle.doneTodo)
// 删除
router.delete('/todo/:id', todoHandle.deleteTodo)
// 删除所选
router.delete('/todo/select/:id', todoHandle.deleteSelectTodo)



















module.exports = router