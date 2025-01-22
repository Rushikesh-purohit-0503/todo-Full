import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    userData: null,
    accessToken: null,
    refreshToken: null
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true
            state.userData = action.payload
        },
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logout: (state) => {
            state.status = false
            state.userData = null
        }
    }
})

export const { login, logout,setTokens } = authSlice.actions;
export default authSlice.reducer    
