const express = require('express')
require('./src/db/mariadb')
const taskRouter = require('./src/router/todotask')

const port = 3000

const app = express()
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST,PUT,DELETE,GET")
    next();
});
app.use(express.json())
app.use(taskRouter)


app.listen(port)