import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { API_URL } from "../../api";
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

interface Form {
    phoneNumber: string;
    new_password: string;
    confirm_new_password: string;
    code: string;
}

export default function ForgotPasswordScreen() {
    const [form, setForm] = useState<Form>({
        phoneNumber: "",
        new_password: "",
        confirm_new_password: "",
        code: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // OTP specific state
    const inputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState(false);
    const [timer, setTimer] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        if (!otpSent || timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    function handleChange(field: keyof Form) {
        return (text: string) =>
            setForm((prev) => ({ ...prev, [field]: text }));
    }

    function handleOTPChange(text: string) {
        if (error !== null) setError(null);
        const digits = text.replace(/\D/g, "");
        setForm(prev => ({ ...prev, code: digits }));
    }

    async function handleForgotPasswordSubmit() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/users/forgot-password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to change password.");
                return;
            }

            router.push("/login");
        } catch {
            setError("Could not connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSendOTP() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/users/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: form.phoneNumber })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.statusCode === 400 ? "Use international format eg: +62123456..." : data.message || "Failed to send otp.");
                return;
            }

            setOtpSent(true);
            setTimer(600);
        } catch {
            setError("Could not connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-slate-950"
        >
            <ScrollView 
                contentContainerClassName="flex-grow items-center px-6 pt-12 pb-6"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInUp.delay(100).duration(600)} className="w-full max-w-sm bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl mt-4">
                    <Text className="text-2xl font-semibold text-white mb-1">Reset Password</Text>
                    <Text className="text-zinc-400 text-sm mb-6">Enter details to reset your password</Text>
                    
                    {/* Step 1: Phone */}
                    <View className="mb-4">
                        <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2 ml-1">Phone Number</Text>
                        <View className={`flex-row items-center bg-slate-950 rounded-2xl border ${focusedField === 'phone' ? 'border-amber-400 bg-slate-900' : 'border-slate-800'} px-4 h-14`}>
                            <Feather name="phone" size={18} color={focusedField === 'phone' ? '#fbbf24' : '#64748b'} className="mr-3" />
                            <TextInput
                                className="flex-1 text-white text-base h-full"
                                value={form.phoneNumber}
                                onChangeText={handleChange("phoneNumber")}
                                keyboardType="phone-pad"
                                placeholder="+6281234567890"
                                placeholderTextColor="#475569"
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => setFocusedField(null)}
                                selectionColor="#fbbf24"
                            />
                        </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between mb-4 px-1">
                        <Text className="text-zinc-400 text-sm font-medium">
                            {otpSent ? (timer > 0 ? `Code expires in ${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}` : "Code expired") : "OTP Verification"}
                        </Text>
                        <Pressable 
                            onPress={handleSendOTP}
                            disabled={loading || (otpSent && timer > 0)}
                            className={`bg-indigo-600 px-4 py-2 rounded-xl active:scale-95 ${loading || (otpSent && timer > 0) ? 'opacity-50' : 'opacity-100'}`}
                        >
                            <Text className="text-white text-xs font-semibold">
                                {loading && !otpSent ? "Sending..." : (otpSent ? (timer > 0 ? `Resend (${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')})` : "Resend OTP") : "Send OTP")}
                            </Text>
                        </Pressable>
                    </View>

                    <Pressable className="flex-row justify-center gap-2.5 mb-6" onPress={() => inputRef.current?.focus()}>
                        <TextInput
                            value={form.code}
                            onChangeText={handleOTPChange}
                            keyboardType="number-pad"
                            maxLength={6}
                            ref={inputRef}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            className="absolute opacity-0 w-full h-full"
                        />
                        {Array.from({ length: 6 }).map((_, i) => {
                            const isActive = focused && i === form.code.length;
                            return (
                                <View
                                    key={i}
                                    className={`w-12 h-14 items-center justify-center border rounded-xl
                                        ${isActive ? "border-amber-400 bg-slate-900" : error && !form.code ? "border-red-500 bg-red-950/40" : "border-slate-800 bg-slate-950"}`}
                                    style={isActive ? {
                                        shadowColor: "#fbbf24",
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 8,
                                        elevation: 4, // Android
                                    } : undefined}
                                >
                                    <Text className="text-2xl text-white font-medium">{form.code[i]}</Text>
                                </View>
                            );
                        })}
                    </Pressable>

                    {/* Step 2: New Passwords */}
                    <View className="mb-4">
                        <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2 ml-1">New Password</Text>
                        <View className={`flex-row items-center bg-slate-950 rounded-2xl border ${focusedField === 'new_password' ? 'border-amber-400 bg-slate-900' : 'border-slate-800'} px-4 h-14`}>
                            <Feather name="lock" size={18} color={focusedField === 'new_password' ? '#fbbf24' : '#64748b'} className="mr-3" />
                            <TextInput
                                className="flex-1 text-white text-base h-full"
                                value={form.new_password}
                                onChangeText={handleChange("new_password")}
                                secureTextEntry
                                placeholder="••••••••"
                                placeholderTextColor="#475569"
                                onFocus={() => setFocusedField('new_password')}
                                onBlur={() => setFocusedField(null)}
                                selectionColor="#fbbf24"
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2 ml-1">Confirm New Password</Text>
                        <View className={`flex-row items-center bg-slate-950 rounded-2xl border ${focusedField === 'confirm' ? 'border-amber-400 bg-slate-900' : 'border-slate-800'} px-4 h-14`}>
                            <Feather name="check-circle" size={18} color={focusedField === 'confirm' ? '#fbbf24' : '#64748b'} className="mr-3" />
                            <TextInput
                                className="flex-1 text-white text-base h-full"
                                value={form.confirm_new_password}
                                onChangeText={handleChange("confirm_new_password")}
                                secureTextEntry
                                placeholder="••••••••"
                                placeholderTextColor="#475569"
                                onFocus={() => setFocusedField('confirm')}
                                onBlur={() => setFocusedField(null)}
                                selectionColor="#fbbf24"
                            />
                        </View>
                    </View>

                    {/* Error */}
                    {error && (
                        <Animated.View entering={FadeInDown.duration(300)} className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 mb-6 flex-row items-center">
                            <Feather name="alert-circle" size={18} color="#f87171" className="mr-3" />
                            <Text className="text-red-400 text-sm flex-1 font-medium">{error}</Text>
                        </Animated.View>
                    )}

                    {/* Submit Button */}
                    <Pressable
                        onPress={handleForgotPasswordSubmit}
                        disabled={loading}
                        className={`bg-amber-400 rounded-2xl h-14 items-center justify-center active:scale-[0.98] active:opacity-90 ${loading ? 'opacity-70' : 'opacity-100 mt-2'}`}
                    >
                        <Text className="text-slate-950 text-lg font-bold tracking-wide">
                            {loading ? "Processing..." : "Reset Password"}
                        </Text>
                    </Pressable>

                    {/* Link back */}
                    <View className="flex-row items-center justify-center mt-6 gap-4">
                        <Pressable onPress={() => router.push("/login")} className="flex-row items-center">
                            <Feather name="arrow-left" size={14} color="#fbbf24" className="mr-1" />
                            <Text className="text-amber-400 text-sm font-semibold">Login</Text>
                        </Pressable>
                        <Text className="text-slate-700">|</Text>
                        <Pressable onPress={() => router.push("/register")} className="flex-row items-center">
                            <Text className="text-amber-400 text-sm font-semibold">Register</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}