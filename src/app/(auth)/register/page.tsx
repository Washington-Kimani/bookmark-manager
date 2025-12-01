"use client";

import React, {useState} from "react";
import { useRouter } from "next/navigation";
import {api} from "@/src/configs/api";
import {toast} from "sonner";
import RegisterForm from "@/src/components/auth/register-form";

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        // register process
        try {
            const response = await api.post("/auth/register",
                {username, email, password},
                {
                    validateStatus: (status: number) => status < 500
                }
            );


            if(response.status === 401) {
                setError("Invalid Credentials");
                setLoading(false);
                return;
            }
            if(response.status === 201) {
                toast.success("Registered successfully")
                setLoading(false);
                router.push("/login");
            }
        } catch (err) {
            setError(`Registration failed: ${err}`);
            setLoading(false);
        }
    };

    return <RegisterForm error={error} handleSubmit={handleSubmit} username={username} setUsername={setUsername} email={email} setEmail={setEmail} password={password} setPassword={setPassword} loading={loading}/>
}
