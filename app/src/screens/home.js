import React from "react";

// import style
import "../styles/home.css";

const axios = require("axios");

class Home extends React.Component {

    constructor(props) {
        super(props);
        // create a state
        this.state = {
        // create a variable to store temporary data
        todoList: [],
        newTodoName: "",
        newTodoCompleted: false,
        // editId: false,
        editId: undefined,
        };
        this.getAllToDos();
    }

    // get all tasks from to-do list
    getAllToDos = () => {
        axios
        .get("http://localhost:8080/todo")
        .then((response) => {
            // handle success
            let data = response.data;
            // store data inside state variable
            this.setState({ todoList: data.todos });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    };
    
    // create to-do list
    createToDoTableRow = (todo) => {
        return (
        <tr>
            <td>{todo.name}</td>
            <td>{todo.completed === true ? <i class="fas fa-check completed"></i> : <i class="fas fa-times pending"></i> }</td>
            <td class="edit" onClick = {() => this.setToDoEditable(todo.id, todo.name, todo.completed)}>edit</td>
        </tr>
        );
    };

    // set edit table
    setToDoEditable = (id, name, completed) => {
        this.setState({
            editId: id,
            newTodoName: name,
            newTodoCompleted: completed, 
        });
    };

    // cancel edit and hide edit table 
    cancelEdit = () => {
        this.setState({
            editId: undefined,
            newTodoName: "",
            newTodoCompleted: false, 
        });
    };

    // add a new task
    addToDo = (e) => {
        e.preventDefault();

        let newTodoName = this.state.newTodoName;
        let newTodoCompleted = this.state.newTodoCompleted;

        let data ={
            name : newTodoName,
            completed : newTodoCompleted,
        };

        axios
        .post("http://localhost:8080/todo", data)
        .then((response) => {
            this.getAllToDos();
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    };

    // edit a task
    editToDo = (e) => {
        e.preventDefault();

        let editedTodoId = this.state.editId;
        let editedTodoName = this.state.newTodoName;
        let editedTodoCompleted = this.state.newTodoCompleted;

        let data ={
            id : editedTodoId,
            namecompleted : editedTodoCompleted,
        };

        axios
        .put("http://localhost:8080/todo", data)
        .then((response) => {
            this.cancelEdit();
            this.getAllToDos();
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    };

    // delete a task
    deleteToDo = (e) => {
        e.preventDefault();

        let deleteTodoId = this.state.editId;

        let data ={
            id : deleteTodoId,
        };

        axios
        .delete("http://localhost:8080/todo", {data})
        .then((response) => {
            this.cancelEdit();
            this.getAllToDos();
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    };

    render() {
        // get data from state variable
        // this.state.VariableName
        if (this.state.todoList.length <= 0) {
        return <div>Loading...</div>;
        }
        return (
        <div class="wrapper">
            <div class="container">
                <h1>To Do Application</h1>
                <div class="new">
                    <h2>{this.state.editId === undefined ? "Add a new to do" : "Edit to do"}</h2>
                    <form>
                        <input 
                            type="text" 
                            placeholder="Add a new task"
                            value={this.state.newTodoName}
                            onChange = {(e) => this.setState( {newTodoName: e.target.value})}
                        ></input>
                        <select 
                            value={this.state.newTodoCompleted === true ? "Yes": "No" } 
                            onChange = {(e) => 
                                this.setState( {
                                    newTodoCompleted: e.target.value === "Yes" ? true : false
                                })
                            }
                        >
                        <option hidden selected>
                            Completed
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        </select>
                        

                        <div class="button">
                            {this.state.editId === undefined && (
                                <button onClick ={this.addToDo}>Add</button>
                            )}

                            {this.state.editId !== undefined && (
                                <button onClick ={this.editToDo}>Edit</button>
                            )}

                            {this.state.editId !== undefined && (
                                <button onClick ={this.deleteToDo}>Delete</button>
                            )}
                        
                            {this.state.editId !== undefined && (
                                <button onClick ={this.cancelEdit}>Cancel edit</button>
                            )}
                        </div>
                    </form>
                </div>

                <div class="lists">
                    <h2>To Do List ({this.state.todoList.length})</h2>
                    {/* FOR EACH LOOP TO EVERY ELEMENT AND CALL createToDoTableRow TO CREATE ROW FOR EACH ELEMENT */}
                    <table>
                        <tr>
                        <th>Task</th>
                        <th>Completed</th>
                        <th></th>
                        </tr>
                        {this.state.todoList.map(this.createToDoTableRow)}
                    </table>
                </div>
            </div>
        </div>
        );
    }
}

export default Home;


