import React from "react";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useDispatch,useSelector } from "react-redux";
import { login,setTokens } from "../store/authSlice";  // Import your Redux action
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../api/api";
import Cookies from 'js-cookie';

const SignIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await signIn(data);
            const result = response.data;
            const userData = result.data.user;
            console.log(userData)
            const accessToken = result.data.accessToken;
            const refreshToken = result.data.newRefreshToken
          
            // Dispatch user data to Redux
            dispatch(login(userData));

            // Save tokens to localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken)
            navigate('/main');  // Navigate to main page after successful login
        } catch (error) {
            console.error("Login failed:", error);
            // Handle error state or display appropriate message
        }
    }
    
    return (
        <React.Fragment>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <main className="flex-grow flex items-center justify-center px-4">
                    <div className="max-w-md w-full">
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
                            <h3
                                className="text-2xl font-bold text-blue-600 text-center hover:cursor-pointer"
                                onClick={() => { navigate('/') }}
                            >
                                Task Master
                            </h3>
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    {...register("email", {
                                        required: true,
                                        validate: {
                                            matchPattern: (value) =>
                                                /^\w+([.-]?\w+)*@\w+([._-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                "Email address must be a valid address",
                                        }
                                    })}
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Password</label>
                                <input
                                    {...register("password", { required: true })}
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                            >
                                Sign In
                            </button>
                            <div className="mt-4 text-center">
                                <p className="text-sm">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/signup"
                                        className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </React.Fragment>
    );
};

export default SignIn;
