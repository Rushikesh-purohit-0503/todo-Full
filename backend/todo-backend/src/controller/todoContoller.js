const ApiError = require('../utils/ApiErrors')
const { ApiResponse } = require('../utils/ApiResponse')
const { USER_ROLES } = require('../constants')


const todoModel = require('../models/todos')
const { default: mongoose } = require('mongoose')

//create new task
const createTodo = async (req, res) => {
    let { title, description, status } = req.body
    let { assignedTo } = req.params
    console.log("assigned_to ", assignedTo); 

    if (!title || status === undefined) {
        throw new ApiError(400, 'Title and status are required')
    }

    if (req.user?.role !== USER_ROLES.admin && assignedTo) throw new ApiError(400, "not authorized to assign tasks")
    description = description || ' '
    assignedTo = assignedTo || req.user._id
    const user_id = req.user?.role === USER_ROLES.admin ? assignedTo : req.user?._id

    if (req?.user?.role === 1 && !assignedTo) {
        console.warn("Admin is creating a task without assigning it to another user. Assigning to self.");
    }
    if (!user_id) throw new ApiError(404, "User not found")
    try {

        const newTodo = await todoModel.create({
            user_id: user_id,
            title: title,
            description: description,
            completed: status
        })

        if (!newTodo) {
            return res.status(201).json(new ApiResponse(201,{},"Task not created!!"))
        }
        return res.status(200).json(new ApiResponse(201, newTodo, "Todo created successfully"))
    } catch (error) {
        throw new ApiError(500, "Error creating Todo", error)
    }


}

//get all task for admin 
const getAlltodos = async (req, res) => {
    const { userId } = req.params;
    try {
        if (userId) {
            const todos = await todoModel
                .find({ user_id: userId })
                .select("-timestamps -__v")
                .exec();

            if (!todos || todos.length === 0) {
                return res.status(201).json(new ApiResponse(201, {}, "no todos found"))
            }
            return res
                .status(200)
                .json(new ApiResponse(200, todos, "Todos retrieved successfully"));
        } else {
            // If no userId provided, retrieve all todos
            const todos = await todoModel
                .find()
                .select("-timestamps -__v")
                .exec();

            return res.status(200).json(
                new ApiResponse(200, todos, todos.length ? "Todos fetched successfully" : "No todos found")
            );

        }
    } catch (error) {
        console.error(error)
    }
};


//loggedin user's tasks {if TaskId is given then => that task } {else All task for that user}
const getTodo = async (req, res) => {
    const userId = req.user?._id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid user ID format"));
    }

    try {
        if (req.params.id) {
            // Validate todo ID
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json(new ApiResponse(400, {}, "Invalid todo ID format"));
            }

            // Fetch a single todo
            const todo = await todoModel.findOne({
                _id: new mongoose.Types.ObjectId(req.params.id),
                user_id: new mongoose.Types.ObjectId(userId),
            }).select('-__v -timestamps');

            if (!todo) {
                return res.status(404).json(new ApiResponse(404, {}, "Todo not found"));
            }

            return res.status(200).json(new ApiResponse(200, todo, "Todo fetched successfully"));
        } else {
            // Fetch all todos for the user
            const todos = await todoModel.find({ user_id: new mongoose.Types.ObjectId(userId) }).select('-__v -timestamps');

            return res.status(200).json(
                new ApiResponse(200, todos, todos.length ? "Todos fetched successfully" : "No todos found")
            );

        } 

    } catch (error) {
        console.error("Error fetching todos:", error);

    }
};



//update tasks for loggedin user and admin
const updateTodo = async (req, res) => {
    const { todoId } = req.params; // Route parameter
    const { title, description, status } = req.body;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    console.log(todoId);
      
    try {
        // Validate todoId
        if (!mongoose.Types.ObjectId.isValid(todoId)) {
            throw new ApiError(400, "Invalid todo ID format");
        }

        // Find the todo
        const todo = await todoModel.findById(todoId);

        if (!todo) {
            throw new ApiError(404, "Todo not found");
        }

        // Authorization: Admin or owner
        if (userRole !== 1 && todo.user_id.toString() !== userId.toString()) {
            throw new ApiError(403, "Not authorized to update this todo");
        }

        // Update the todo
        const updatedTodo = await todoModel.findOneAndUpdate(
            { _id: todoId },
            {
                title: title || todo.title,
                description: description || todo.description,
                completed: status !== undefined ? status : todo.completed
            },
            { new: true } // Return updated todo
        ).select('-__v');
   
        if (!updatedTodo) {
            throw new ApiError(500, "Error updating the todo");
        }

        res.status(200).json(new ApiResponse(200, updatedTodo, "Todo updated successfully"));
    } catch (error) {
        throw new ApiError(error.status || 500, error.message, error);
    }
};


const deleteTodo = async (req, res) => {
    const { todoId } = req.params; // Route parameter


    try {
        if (!mongoose.Types.ObjectId.isValid(todoId)) {
            throw new ApiError(400, "Invalid todo ID format");
        }

        // if (req.user.role !== USER_ROLES.admin) { 
        //     throw new ApiError(403, "Not authorized: Only admins can delete users");
        // }
        const todo = await todoModel.findById(todoId);
        if (!todo) { throw new ApiError(404, "Todo not found") }
        const result = await todo.deleteOne({ _id: todoId })
        return res.status(200).json(new ApiResponse(200, result, "User deleted successfully"))

    } catch (error) {
        throw new ApiError(error?.status, "Error deleting the todo", error);
    }
}
module.exports = {
    createTodo,
    getAlltodos,
    getTodo,
    updateTodo,
    deleteTodo
}