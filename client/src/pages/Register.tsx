import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";
import { ButtonLink } from "../components/ButtonLink";
import { Form } from "../components/Form";
import { Heading } from "../components/Heading";
import React, {useRef, useState, useEffect} from "react";
import { API_URL } from "../api";

export function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirm_password: "",
        code: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState("form");
    const inputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const [timer, setTimer] = useState(600);

    useEffect(() => {
        if (page !== "otp" || timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [page, timer]);

    function handleChange(field: keyof typeof formData){
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

    function handleOTPChange(e: React.ChangeEvent<HTMLInputElement>){
        if (error !== null) setError(null);
        const digits = e.target.value.replace(/\D/g, "");
        return setFormData(prev => ({ ...prev, code: digits }));
    }

    async function handleRegister(){

        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration failed. Please try again.");
                return;
            }

            navigate("/login");

        } catch {
            setError("Please connect to a Wi-Fi network and try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSendOTP(){
        setLoading(true);
        setError(null);

        try {
            const check = await fetch(`${API_URL}/api/users/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const checkData = await check.json()
            if (!check.ok){
                setError(checkData.message || "Failed checks.")
                return
            }

            const response = await fetch(`${API_URL}/api/users/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phoneNumber })
            })
            const data = await response.json();
            if (!response.ok){
                setError(data.statusCode === 400 ? "Use international format eg: +62123456..." : data.message || "Failed to send otp.");
                return;
            }

            setPage("otp");
            setTimer(600);
        } catch {
            setError("Please connect to a Wi-Fi network and try again.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="mx-auto px-4 sm:px-12 pt-5 pb-10 flex flex-col gap-8 sm:gap-12 items-center min-h-screen select-none">
            <Header variant="register" />
            { page === "form" ? (
                <div className="flex flex-col gap-4 p-6 sm:p-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 shadow-2xl items-center rounded-2xl w-full max-w-md">
                    <div className="text-center mb-2">
                        <Heading>Create Account</Heading>
                        <h2 className="text-zinc-400 text-sm sm:text-base mt-2">Join the servants team</h2>
                    </div>

                    <div className="w-full flex flex-col gap-3.5">
                        <Form label="Full Name"         value={formData.name}               onChange={handleChange("name")} />
                        <Form label="Email"             value={formData.email}              onChange={handleChange("email")} type="email" />
                        <Form label="Phone Number"      value={formData.phoneNumber}        onChange={handleChange("phoneNumber")} type="tel" />
                        <Form label="Password"          value={formData.password}           onChange={handleChange("password")} />
                        <Form label="Confirm Password"  value={formData.confirm_password}   onChange={handleChange("confirm_password")} />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center w-full mt-1 bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</p>
                    )}

                    <div className="w-full mt-4 flex flex-col gap-6">
                        <button
                            onClick={() => handleSendOTP()}
                            disabled={loading}
                            className="bg-amber-400 text-slate-900 text-[15px] font-bold py-2.5 sm:py-3 rounded-xl w-full hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-400/20
                            active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? "Loading..." : "Register"}
                        </button>

                        <div className="flex items-center justify-center gap-2">
                            <span className="text-zinc-400 text-sm">Already have an account?</span>
                            <ButtonLink to='/login' variant="secondary" className="text-amber-400 text-sm font-semibold hover:text-amber-300">Login</ButtonLink>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-6 p-6 sm:p-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 shadow-2xl items-center rounded-2xl w-full max-w-md min-h-96">
                    <div className="text-center">
                        <Heading>OTP Verification</Heading>
                        <h2 className="text-zinc-400 text-sm sm:text-base mt-2">We just sent an SMS to <span className="text-zinc-200">{formData.phoneNumber}</span></h2>
                    </div>

                    <div className="relative inline-flex gap-2 sm:gap-3 mt-4" onClick={() => inputRef.current?.focus()}>
                        <input
                            value={formData.code}
                            onChange={handleOTPChange}
                            inputMode="numeric"
                            type="text"
                            pattern="[0-9]*"
                            maxLength={6}
                            ref={inputRef}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            className="absolute w-full h-full opacity-0 cursor-text"
                        />
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                            key={i}
                            className={`w-11 sm:w-14 h-14 sm:h-16 flex items-center justify-center text-xl sm:text-2xl text-zinc-100 font-mono border rounded-xl transition-all duration-200
                                ${focused && i === formData.code.length ? "border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]" : error ? "border-red-500 bg-red-500/10" : "border-slate-600 bg-slate-700/50"} `}
                            >
                                {formData.code[i]}
                            </div>
                        ))}
                    </div>

                    <div className="text-zinc-400 text-sm text-center">
                        Code expires in <span className="text-amber-400 font-medium">{Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}</span>
                    </div>

                    {error && (<span className="text-center text-red-400 text-sm bg-red-400/10 py-2 px-4 rounded-lg border border-red-400/20 w-full">{error}</span>)}

                    <div className="w-full mt-auto flex flex-col gap-4">
                        <button
                            className="bg-indigo-600 text-white rounded-xl w-full py-2.5 sm:py-3 text-[15px] font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
                            onClick={() => handleRegister()}
                        >
                            Verify Code
                        </button>
                        <button
                            onClick={() => setPage("form")}
                            className="text-zinc-400 hover:text-amber-400 text-sm font-medium transition-colors py-2"
                        >
                            ← Back to register
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
