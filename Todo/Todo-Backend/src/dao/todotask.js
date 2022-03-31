const connection = require('../db/mariadb');

module.exports = {
    createTask: createTask,
    fetchTask: fetchTask,
    deleteTask: deleteTask,
    updateTask: updateTask,
    deleteAllTask: deleteAllTask,
    deleteRandomTask: deleteRandomTask,
}

function createTask(data) {
    return new Promise((resolve, reject) => {
        connection.Todo.create(data).then((rowsUpdated) => {
            resolve(rowsUpdated);
        }).catch(err => {
            reject(err);
            return;
        });
    });
}

function deleteTask(data) {
    const where = {
        task_id: data.task_id
    }
    return new Promise((resolve, reject) => {
        connection.Todo.destroy({ where: where }).then((rowsUpdated) => {
            resolve(rowsUpdated);
        }).catch(err => {
            reject(err);
            return;
        });
    })
}

function updateTask(data) {
    const where = {
        task_id: data.task_id
    }
    return new Promise((resolve, reject) => {
        connection.Todo.update(data, { where: where }).then((rowsUpdated) => {
            resolve(rowsUpdated);
        }).catch(err => {
            reject(err);
            return;
        });
    });
}

function fetchTask() {
    return new Promise((resolve, reject) => {
        connection.Todo.findAll().then(task => {
            resolve(task);
        }).catch(err => {
            reject(err);
            return;
        });
    });
}

function deleteAllTask() {
    return new Promise((resolve, reject) => {
        connection.Todo.destroy({ where: {} }).then(task => {
            resolve(task);
        }).catch(err => {
            reject(err);
            return;
        })
    })
}

function deleteRandomTask(data) {
    console.log(data.task_id)
    const where = {
        task_id: data.task_id
    }
    return new Promise((resolve, reject) => {
        connection.Todo.destroy({ where: where }).then((rowsUpdated) => {
            resolve(rowsUpdated);
        }).catch(err => {
            reject(err);
            return;
        });
    })
}