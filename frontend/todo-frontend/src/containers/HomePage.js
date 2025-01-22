import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-blue-100">

            {/* Navigation */}
            <nav className="px-4 py-2 flex justify-between w-full bg-white items-center">
                <h1 className="text-2xl font-bold text-blue-600">TaskMaster</h1>
                <div className="space-x-4">
                    <button
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:text-gray-800 hover:bg-gray-50 transition-colors"
                        onClick={() => { navigate('/login') }}
                    >
                        Login
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={() => { navigate('/signup') }}
                    >
                        Sign Up
                    </button>
                </div>
            </nav>

            <div className="mx-auto px-4">


                {/* Hero Section */}
                <div className="py-20 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Organize your tasks with ease
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Keep track of everything you need to do in one place
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => { navigate('/signup') }}
                        >
                            <UserPlus className="h-5 w-5" />
                            Get Started
                        </button>
                        <button
                            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={() => { navigate('/login') }}
                        >
                            <LogIn className="h-5 w-5 " />
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-3">Simple Task Management</h3>
                            <p className="text-gray-600">
                                Easily create, organize, and track your daily tasks
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-3">Stay Organized</h3>
                            <p className="text-gray-600">
                                Keep all your tasks organized and never miss a deadline
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
                            <p className="text-gray-600">
                                Monitor your progress and celebrate completing tasks
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;