const Joi = require('joi')

const username = Joi.string().alphanum().min(1).max(7).required()
const password = Joi.string().alphanum().pattern(/^[\S]{6,15}$/).required()

exports.reg_login_schema = {
  body: {
    username,
    password
  }
}