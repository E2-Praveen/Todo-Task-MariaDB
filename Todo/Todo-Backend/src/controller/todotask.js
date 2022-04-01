const responseMSG = require('../../config')
const todoTaskDAO = require('../dao/todotask')

function createTask(req, res) {
    return todoTaskDAO.createTask(req.body).then(function () {
        res.status(201).send(responseMSG.successResponse(null,"Added successfully"));
    }).catch(e => {
        res.status(500).send(responseMSG.failureResponse(e.message))
    })
}

function deleteTask(req,res){
    return todoTaskDAO.deleteTask(req.body).then(function (userResponse){
        if(userResponse == 0){
            res.status(400).send(responseMSG.failureResponse("Task id doesn't exits"));
        }else{
            res.status(200).send(responseMSG.successResponse(null,"Deleted successfully"))
        }
    }).catch((e) =>{
        res.status(500).send(responseMSG.failureResponse(e.message))
    })
}

function updateTask(req,res){
    return todoTaskDAO.updateTask(req.body).then(function (){
        res.status(200).send(responseMSG.successResponse(null,"Modified successfully"))
    }).catch(e =>{
        res.status(500).send(responseMSG.failureResponse(e.message))
    })
}

function fetchTask(req, res) {
    return todoTaskDAO.fetchTask().then(function (response) {
        res.status(200).send(responseMSG.successResponse(response,"Task fetched successfully"))
    }).catch(e => {
        res.status(500).send(responseMSG.failureResponse("Unable to Fetch the Task"))
    })
}

function deleteAllTask(req,res){
    return todoTaskDAO.deleteAllTask().then(function (){
        res.status(200).send(responseMSG.successResponse(null,"Deleted successfully"))
    }).catch(e =>{
        res.status(500).send(responseMSG.failureResponse(e.message))
    })
}

function deleteRandomTask(req,res){
    return todoTaskDAO.deleteRandomTask(req.body).then(function (){
        res.status(200).send(responseMSG.successResponse(null,"Deleted successfully"))
    }).catch(e =>{
        res.status(400).send(responseMSG.failureResponse(e.message))
    })
}


module.exports = {
    createTask: createTask,
    fetchTask: fetchTask,
    deleteTask: deleteTask,
    updateTask: updateTask,
    deleteAllTask: deleteAllTask,
    deleteRandomTask: deleteRandomTask,
}