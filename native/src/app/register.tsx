import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { API_URL } from "../../api";
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

export default function RegisterScreen() {
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
    const inputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState(false);
    const [timer, setTimer] = useState(600);
    
    // Track focus for premium input states
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        if (page !== "otp" || timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [page, timer]);

    function handleChange(field: keyof typeof formData) {
        return (text: string) =>
            setFormData((prev) => ({ ...prev, [field]: text }));
    }

    function handleOTPChange(text: string) {
        if (error !== null) setError(null);
        const digits = text.replace(/\D/g, "");
        setFormData(prev => ({ ...prev, code: digits }));
    }

    async function handleRegister() {
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

            router.push("/login");

        } catch {
            setError("Please connect to a Wi-Fi network and try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSendOTP() {
        setLoading(true);
        setError(null);

        try {
            const check = await fetch(`${API_URL}/api/users/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const checkData = await check.json();
            if (!check.ok){
                setError(checkData.message || "Failed checks.");
                return;
            }

            const response = await fetch(`${API_URL}/api/users/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phoneNumber })
            });
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
                {page === "form" ? (
                    <Animated.View entering={FadeInUp.delay(100).duration(600)} className="w-full max-w-sm bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl mt-4">
                        <Text className="text-2xl font-semibold text-white mb-1">Create Account</Text>
                        <Text className="text-zinc-400 text-sm mb-6">Join the servants team</Text>
                        
                        {/* Name Input */}
                        <View className="mb-4">
                            <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2 ml-1">Full Name</Text>
                            <View className={`flex-row items-center bg-slate-950 rounded-2xl border ${focusedField === 'name' ? 'border-amber-400 bg-slate-900' : 'border-slate-800'} px-4 h-14`}>
                                <Feather name="user" size={18} color={focusedField === 'name' ? '#fbbf24' : '#64748b'} className="mr-3" />
                                <TextInput
                                    className="flex-1 text-white text-base h-full"
                                    value={formData.name}
                                    onChangeText={handleChange("name")}
                                    placeholder="John Doe"
                                    placeholderTextColor="#475569"
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    selectionColor="#fbbf24"
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View className="mb-4">
                            <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2 ml-1">Email</Text>
                            <View className={`flex-row items-center bg-slate-950 rounded-2xl border ${focusedField === 'email' ? 'border-amber-400 bg-slate-900' : 'border-slate-800'} px-4 h-14`}>
                                <Feather name="mail" size={18} color={focusedField === 'email' ? '#fbbf24' : '#64748b'} className="mr-3" />
                                <TextInput
                                    className="flex-1 text-white text-base h-full"
                                    value={formData.email}
                                    onChangeText={handleChange("email")}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="john@example.com"
                                    placeholderTextColor="#475569"
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    selectionColor="#fbbf24"
                                />
                            </View>
                        </View>

                        {/* Phone Input */}
                        <View className="mb-4">
                            <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2 ml-1">Phone Number</Text>
                            <View className={`flex-row items-center bg-slate-950 rounded-2xl border ${focusedField === 'phone' ? 'border-amber-400 bg-slate-900' : 'border-slate-800'} px-4 h-14`}>
                                <Feather name="phone" size={18} color={focusedField === 'phone' ? '#fbbf24' : '#64748b'} className="mr-3" />
                                <TextInput
                                    className="flex-1 text-white text-base h-full"
                                    value={formData.phoneNumber}
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

                        {/* Password Input */}
                        <View className="mb-4">
                            <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2 ml-1">Password</Text>
                            <View className={`flex-row items-center bg-slate-950 rounded-2xl border ${focusedField === 'password' ? 'border-amber-400 bg-slate-900' : 'border-slate-800'} px-4 h-14`}>
                                <Feather name="lock" size={18} color={focusedField === 'password' ? '#fbbf24' : '#64748b'} className="mr-3" />
                                <TextInput
                                    className="flex-1 text-white text-base h-full"
                                    value={formData.password}
                                    onChangeText={handleChange("password")}
                                    secureTextEntry
                                    placeholder="••••••••"
                                    placeholderTextColor="#475569"
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    selectionColor="#fbbf24"
                                />
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View className="mb-6">
                            <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2 ml-1">Confirm Password</Text>
                            <View className={`flex-row items-center bg-slate-950 rounded-2xl border ${focusedField === 'confirm' ? 'border-amber-400 bg-slate-900' : 'border-slate-800'} px-4 h-14`}>
                                <Feather name="check-circle" size={18} color={focusedField === 'confirm' ? '#fbbf24' : '#64748b'} className="mr-3" />
                                <TextInput
                                    className="flex-1 text-white text-base h-full"
                                    value={formData.confirm_password}
                                    onChangeText={handleChange("confirm_password")}
                                    secureTextEntry
                                    placeholder="••••••••"
                                    placeholderTextColor="#475569"
                                    onFocus={() => setFocusedField('confirm')}
                                    onBlur={() => setFocusedField(null)}
                                    selectionColor="#fbbf24"
                                />
                            </View>
                        </View>

                        {/* Error Message */}
                        {error && (
                            <Animated.View entering={FadeInDown.duration(300)} className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 mb-6 flex-row items-center">
                                <Feather name="alert-circle" size={18} color="#f87171" className="mr-3" />
                                <Text className="text-red-400 text-sm flex-1 font-medium">{error}</Text>
                            </Animated.View>
                        )}

                        {/* Submit Button */}
                        <Pressable
                            onPress={handleSendOTP}
                            disabled={loading}
                            className={`bg-amber-400 rounded-2xl h-14 items-center justify-center active:scale-[0.98] active:opacity-90 ${loading ? 'opacity-70' : 'opacity-100 mt-2'}`}
                        >
                            <Text className="text-slate-950 text-lg font-bold tracking-wide">
                                {loading ? "Loading..." : "Register"}
                            </Text>
                        </Pressable>

                        <View className="flex-row items-center justify-center mt-6 gap-2">
                            <Text className="text-zinc-400 text-sm">Already have an account?</Text>
                            <Pressable onPress={() => router.push("/login")}>
                                <Text className="text-amber-400 text-sm font-semibold">Login</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInUp.delay(100).duration(600)} className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl mt-12 items-center">
                        <View className="w-16 h-16 bg-slate-800 rounded-2xl items-center justify-center mb-4 border border-slate-700">
                            <Feather name="shield" size={28} color="#fbbf24" />
                        </View>
                        <Text className="text-2xl font-semibold text-white mb-2">OTP Verification</Text>
                        <Text className="text-zinc-400 text-sm text-center mb-8">
                            We just sent an SMS to{"\n"}
                            <Text className="text-white font-medium">{formData.phoneNumber}</Text>
                        </Text>

                        <Pressable className="flex-row gap-2 mb-8" onPress={() => inputRef.current?.focus()}>
                            <TextInput
                                value={formData.code}
                                onChangeText={handleOTPChange}
                                keyboardType="number-pad"
                                maxLength={6}
                                ref={inputRef}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                className="absolute opacity-0 w-full h-full"
                            />
                            {Array.from({ length: 6 }).map((_, i) => {
                                const isActive = focused && i === formData.code.length;
                                return (
                                    <View
                                        key={i}
                                        className={`w-11 h-14 items-center justify-center border rounded-xl
                                            ${isActive ? "border-amber-400 bg-slate-900" : error ? "border-red-500 bg-red-950/40" : "border-slate-800 bg-slate-950"}`}
                                        style={isActive ? {
                                            shadowColor: "#fbbf24",
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: 0.2,
                                            shadowRadius: 8,
                                            elevation: 4, // Android
                                        } : undefined}
                                    >
                                        <Text className="text-2xl text-white font-medium">{formData.code[i]}</Text>
                                    </View>
                                );
                            })}
                        </Pressable>

                        <Text className="text-zinc-400 text-sm mb-6">
                            Code expires in <Text className="text-amber-400 font-medium">{Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}</Text>
                        </Text>

                        {error && (
                            <Animated.View entering={FadeInDown.duration(300)} className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 mb-6 flex-row items-center w-full">
                                <Feather name="alert-circle" size={18} color="#f87171" className="mr-3" />
                                <Text className="text-red-400 text-sm flex-1 font-medium">{error}</Text>
                            </Animated.View>
                        )}

                        <Pressable
                            onPress={handleRegister}
                            disabled={loading}
                            className={`bg-amber-400 rounded-2xl h-14 w-full items-center justify-center active:scale-[0.98] active:opacity-90 ${loading ? 'opacity-70' : 'opacity-100'}`}
                        >
                            <Text className="text-slate-950 text-lg font-bold tracking-wide">
                                {loading ? "Verifying..." : "Verify Code"}
                            </Text>
                        </Pressable>
                        
                        <Pressable
                            onPress={() => setPage("form")}
                            className="mt-6 py-2"
                        >
                            <Text className="text-zinc-400 font-medium flex-row items-center">
                                <Feather name="arrow-left" size={14} color="#a1a1aa" className="mr-1" /> Back to register
                            </Text>
                        </Pressable>
                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
