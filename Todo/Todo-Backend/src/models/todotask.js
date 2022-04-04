module.exports = (sequelize, type) => {
    return sequelize.define('TodoTasks', {
        task_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        task_name: {
            type: type.STRING,
            required: true
        },
        task_status: {
            type: type.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamps: true
    })
}