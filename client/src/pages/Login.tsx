import { Header } from "../components/Header";
import React, { useState } from "react";
import { ButtonLink } from "../components/ButtonLink";
import { Form } from "../components/Form";
import { Heading } from "../components/Heading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../api"

export function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        phoneNumber: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function handleChange(field: keyof typeof formData){
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, [field]: e.target.value}))
    }

    async function handleLogin(){
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed. Please try again.");
                return;
            }

            login(data.token, data.user);
            
            navigate("/home");
        } catch {
            setError("Please connect to a Wi-Fi network.");
        } finally {
            setLoading(false);
        }
    }
    
    return(
        <div className="mx-auto px-4 sm:px-12 py-5 flex flex-col gap-7 sm:gap-15 items-center select-none">
            <Header variant="login" />
            <div className="flex flex-col gap-0.5 sm:gap-1.5 p-6 sm:p-7 bg-slate-800 items-center rounded-xl w-80 sm:w-100 min-h-104 sm:h-118">
                <div className="mt-2">
                    <Heading>Login</Heading>
                </div>
                <div className="mt-4 mb-4">
                    <h2 className="text-zinc-400 sm:text-lg">
                        No one comes to help, no one comes to contribute, everybody comes to learn and to serve - Stephen Tong
                    </h2>
                </div>
                <Form label="Phone number"  value={formData.phoneNumber}    onChange={handleChange("phoneNumber")} type="tel" />
                <Form label="Password"      value={formData.password}       onChange={handleChange("password")} type="password"/>

                {error && (
                    <p className="mt-1 sm:mt-0 text-red-400 text-sm text-center w-full">{error}</p>
                )}

                <div className={`w-full flex justify-end ${error ? 'mb-8 sm:mb-0' : ''}`}>
                    <ButtonLink to="/forgot-password" variant="secondary" className="text-amber-400 text-sm">Forgot Password?</ButtonLink>
                </div>

                <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-amber-400 text-blue-950 text-base font-semibold py-1.5 rounded-lg w-full mt-auto hover:bg-amber-500 flex justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    )
}
