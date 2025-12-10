"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/src/contexts/AuthContext";
import {User} from "@/src/utils/types";
import {toast} from "sonner";
import {Eye, EyeClosed} from "lucide-react";
import {api} from "@/src/configs/api";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const {login} = useAuth();

    // handle login success
    const handleLoginSuccess = (token: string, user: User) => {
        setLoading(false);
        login(token, user)
        toast.success("Login successfully");
        router.push("/bookmarks");
        return;
    }
    // handle password show
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // basic validation
        if (!email || !password) {
            setError("Please enter both email and password.");
            setLoading(false);
            return;
        }

        // login process
        try {
            const response = await api.post("/auth/login",
                {email, password},
                {
                    validateStatus: (status: number) => status < 500
                }
            );

            const data = response.data;
            if(response.status === 401) {
                setError("Invalid Credentials");
                setLoading(false);
                return;
            }
            if(data.access_token && data.user) {
                handleLoginSuccess(data.access_token, data.user);
            }
        } catch (err) {
            setError(`Login failed: ${err}`);
            setLoading(false);
        }
    };

    return (
        <main className={"w-11/12 mx-auto lg:w-full h-screen flex items-center justify-center"}>
            <div className="w-full sm:w-96 p-8 bg-white shadow-xl shadow-cyan-500/50 rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login</h2>

                {/* error message */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* email input */}
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
                            disabled={loading}
                            className="w-full py-3 bg-[#056760] text-white font-semibold rounded-md hover:bg-[#045d55] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don&#39;t have an account?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}