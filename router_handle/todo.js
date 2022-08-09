const db = require('../db/index')


exports.getTodoList = (req, res) => {
  const userinfo = req.body
  const sqlStr = `select * from todoList_users where id=? and username=?`
  db.query(sqlStr, [userinfo.id, userinfo.username], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return res.cc('获取列表失败')
    }

    const sql = `select * from todoList_todo where username=?`
    db.query(sql, userinfo.username, (err, results) => {
      if (err) {
        return res.cc(err)
      }
      res.cc('请求成功', 0, results)
    })
  })
}


exports.setNewTodo = (req, res) => {
  const userinfo = req.body
  const sqlStr = `select * from todoList_users where id=? and username=?`
  db.query(sqlStr, [userinfo.id, userinfo.username], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      console.log(results);
      return res.cc('获取列表失败')
    }

    const sql = `insert into todoList_todo set ?`
    db.query(sql, { username: userinfo.username, todo: userinfo.todo }, (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.affectedRows !== 1) {
        res.cc('添加失败')
      }
      const newSql = `select * from todoList_todo where username=?`
      db.query(newSql, userinfo.username, (err, results) => {
        if (err) {
          res.cc(err)
        }
        res.cc('添加成功', 0, results[results.length - 1])
      })
    })
  })
}



exports.updateTodo = (req, res) => {
  const userinfo = req.body
  const sqlStr = `update todoList_todo set todo=? where id=? and username=?`
  db.query(sqlStr, [userinfo.todo, req.params.id, userinfo.username], (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows !== 1) {
      return res.cc('更新失败')
    }
    const sql = `select * from todoList_todo where id=?`
    db.query(sql, userinfo.id, (err, results) => {
      if (err) {
        return res.cc(err)
      }
      res.cc('更新成功', 0, results[0])
    })
  })
}


exports.doneTodo = (req, res) => {
  const sqlStr = `select * from todoList_todo where id=?`
  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    // 定义一个查找方法
    function search() {
      const sqlDone = `select * from todoList_todo where id=?`
      db.query(sqlDone, req.params.id, (err, results) => {
        if (err) {
          return res.cc(err)
        }
        res.cc('状态改变成功', 0, results[0])
      })
    }
    const isZero = results[0].done === 0
    const sql = `update todoList_todo set done=? where id=?`
    if (isZero) {
      return db.query(sql, [1, req.params.id], (err, results) => {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows !== 1) {
          return res.cc('更新状态失败1')
        }
        search()
      })
    } else {
      return db.query(sql, [0, req.params.id], (err, results) => {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows !== 1) {
          return res.cc('更新状态失败2')
        }
        search()
      })
    }
  })
}


exports.deleteTodo = (req, res) => {
  const sqlStr = `DELETE FROM todoList_todo WHERE id=?`
  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows !== 1) {
      return res.cc('删除失败')
    }
    res.cc('删除成功', 0)
  })
}


exports.deleteSelectTodo = (req, res) => {
  const str = req.params.id
  const sqlStr = `delete from todoList_todo where id in (${str})`
  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows === 0) {
      return res.cc('所选内容不存在')
    }
    res.cc('删除成功', 0)
  })
}