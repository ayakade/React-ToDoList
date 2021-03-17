const express = require("express");
const app = express();
const cors = require("cors");

const port = 8080;
let dataObj = require("./data.json");
app.use(express.json());

app.use(cors());

// get all tasks from to-do list
function getToDos(req, res) {
    let data = dataObj; // get the data from the file
    let response = { todos: data}; // create a new response with the current data object to be returned
    // return the response to user
    res.send(response);
}

// add a new task
function addToDo(req, res) {
    let data = dataObj;
    let allIds = data.map(function (todo) {
        return todo.id;
      });
    
    // get the last/max id from all id's and increment it by 1
    let maxId = Math.max.apply(Math, allIds) + 1;

    // creating a new todo object 
    let newToDo = {
        completed: req.body.completed, 
        id: maxId, 
        name: req.body.name,
    };
    
    // add new todo in the data array
    data.push(newToDo);

    // create a new response with the current data object to be returned
    let response = { todos: data };

    // return the response to user
    res.send(response);
    
    console.log(data);
    // console.log(req.body); 
    // console.log(maxId);
}

// update a task
function updateToDo(req,res) {
    let data = dataObj;

    // check if the element exsists in the array
    let ifExists = data.some(function (todo) {
        if(todo.id === req.body.id) {
            return todo;
        }
    });

    // if element does not exist 
    if(!ifExists) {
        //create a new responce with the current data object to be returned
        let response = { message: "To Do does not exist."};
        res.send(response); // return the responce to user
    } else {
        // if element exists 
        let newData = data.map(function (todo) {
            if(todo.id === req.body.id) {
                // update the data
                todo.name = req.body.name;
                todo.completed = req.body.completed;
            }

            return todo;
        });

    // assign the actual data object with the data object
    dataObj = newData;
        
    // create a new responce with the current data object to be returned
    let response = { todos: dataObj };

    // return the responce to user
    res.send(response);
    }
}

// delete a task 
function deleteToDo(req,res) {
    let data = dataObj;

     // check if the element exsists in the array
    let ifExists = data.some(function (todo) {
        if(todo.id === req.body.id) {
            return todo;
        }
    });

    // if element does not exist 
    if(!ifExists) {
        let response = { message: "To Do does not exist."};
        res.send(response);
    } else {
        // if element exists 
        let newData = data.filter(function (todo) {
            // check if the id match with the id user provided to update
            if(todo.id !== req.body.id) {
                // return the todo if it does not exist
                return todo;
            }
        });

        // assign the actual data object with the data object
        dataObj = newData;
            
        // create a new responce with the current data object to be returned
        let response = { todos: dataObj };

        // return the responce to user
        res.send(response);
    }
}

// CRUD operations
app.get("/todo", getToDos);
app.post("/todo", addToDo);
app.put("/todo", updateToDo);
app.delete("/todo", deleteToDo);

function appStart() {
    console.log("To-Do-API listening at "+ port);
}

app.listen(port, appStart);