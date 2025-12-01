"use client";

import React from "react";
import {Eye, EyeClosed} from "lucide-react";

interface RegisterFormProps {
    error: string | null;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    username: string;
    setUsername: (username: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    loading: boolean;
}

const RegisterForm = (
        {
          error,
          handleSubmit,
          username,
          setUsername,
          email,
          setEmail,
          password,
          setPassword,
          loading
        }: RegisterFormProps
    ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    return (
        <main className={"w-11/12 mx-auto lg:w-full h-screen flex items-center justify-center shadow-lg"}>
            <div className="w-full sm:w-96 p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Register</h2>

                {/* error message */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* username input */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                            Username
                        </label>
                        <input
                            id="email"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    {/*email input*/}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* password input */}
                    <div className={'relative'}>
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                        {showPassword ? <Eye className={"absolute right-3 top-[55%] cursor-pointer"} onClick={()=>handleShowPassword()}/> : <EyeClosed className={"absolute right-3 top-[55%] cursor-pointer"} onClick={()=>handleShowPassword()}/>}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#056760] text-white font-semibold rounded-md hover:bg-[#045d55] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </div>
                </form>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default RegisterForm;