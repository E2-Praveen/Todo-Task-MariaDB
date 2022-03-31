const todoTask = require('../models/todotask');

const sequelize = require('sequelize')
const sequelizeData = new sequelize('Todo_Task_DB', 'root', 'my-password-here', {
    dialect: 'mariadb'
})

const Todo = todoTask(sequelizeData, sequelize.DataTypes);

module.exports = {
    Todo
}