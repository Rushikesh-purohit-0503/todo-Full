import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/api";

const SignUp = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [error,setError] = useState('')
    const navigate = useNavigate();
    const password = watch("password");
    const onSubmit = async (data) => {
        try {
            setError('')
            const response = await signUp(data).unwrap()
            console.log(response)
            navigate('/login')
        } catch (error) {
            console.error("SignUp faild: ", error.response.data.message);
            setError(error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <main className="flex-grow flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-blue-600 text-center hover:cursor-pointer" onClick={
                            () => { navigate('/') }
                        }>TaskMaster</h3>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Username</label>
                            <input
                                {...register("userName", { required: true })}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter userName"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                {...register("email", {
                                    required: true,
                                    validate: {
                                        matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([._-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address",
                                    }
                                })}
                                placeholder="Enter email"
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input
                                {...register("password", { required: true })}
                                placeholder="Enter password"
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Confirm Password</label>
                            <input
                                {...register("confirmPassword", {
                                    required: true,
                                    validate: (value) => (value === password || "Passwords do not match")
                                })}
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Sign Up
                        </button>
                        <div className="mt-4 text-center">
                            <p className="text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
                                    Sign In {" "}
                                </Link>
                            </p>
                        </div>
                    </form>
                    {error && <p className="text-red-500 text-sm">{error.message}</p>}
                </div>
            </main>
        </div>
    )
}

export default SignUp