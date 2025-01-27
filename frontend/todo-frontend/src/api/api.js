import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3500/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})



// API Functions

export const signUp = async (data) => {
    return await api.post("/users/create", data);
};

export const signIn = async (data) => {
    return await api.post("/users/login", data);
};

export const logOut = async () => {
    return await api.post("/users/logout");
};    


/// Tasks Api ///
export const fetchTodos = async () => {
    return await api.post("/todos/user-tasks"); 
};

export const fetchAllTodos = async () => {
    return await api.post('/todos/all-tasks')
}

export const fetchUserTasks= async (id) => {
    return await api.post(`todos/all-tasks/${id}`)
}

export const createTodo = async (data) => {
    return await api.post("/todos/new-task", data);
};

export const createTodoAdmin = async (id,data) =>{
    return await api.post(`todos/admin-new-task/${id}`,data)
}

export const updateTodo = async (id, data) => {
    return await api.put(`/todos/update/${id}`, data);
};

export const updateTodoAdmin = async (id, data) => {
    return await api.put(`/todos/update-admin/${id}`, data);
}

export const deleteTodo = async (id) => {
    return await api.delete(`/todos/delete/${id}`);
};


/// User Apis ///
export const fetchUsers = async () => {
    return await api.post('/users/admin/all')
}

export const updateUser = async (data) => {
    return await api.put(`/users/update`, data);
}

export const updateSelectedUser = async (id,data) => {
    return await api.put(`/users/update/${id}`, data);
}

export const deleteUser = async (id) => {
    return await api.delete(`/users/delete/${id}`)
}

