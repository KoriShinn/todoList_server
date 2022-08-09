const Joi = require('joi')

const todo = Joi.string().min(1).max(255).required()

exports.add_todo_schema = {
  body: {
    todo
  }
}