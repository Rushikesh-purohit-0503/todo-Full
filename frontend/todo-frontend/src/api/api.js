import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3500/api",
    headers: {
        "Content-Type": "application/json",
    }

})

export const signUp = async (data) => {
    return await api.post("/users/create", data)
}

export const signIn = async (data) => {
    return await api.post("/users/login", data,{
        withCredentials: true,
    })
}

export const logOut = async () => {
    return await api.post("/users/logout",{},{
        withCredentials: true
    })
} 