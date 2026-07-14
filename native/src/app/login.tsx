import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "../../api";
import { router } from 'expo-router';
import { Pressable, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen() {
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        phoneNumber: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Track focus for premium input states
    const [focusedField, setFocusedField] = useState<string | null>(null);

    function handleChange(field: keyof typeof formData) {
        return (text: string) =>
            setFormData((prev) => ({ ...prev, [field]: text }));
    }

    async function handleLogin(){
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed. Please try again.");
                return;
            }

            await login(data.token, data.user);
            router.push("/(tabs)/home");
        } catch {
            setError("Please connect to a Wi-Fi network.");
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
                
                {/* ── Header Section with Entrance Animation ── */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} className="items-center mb-6 mt-5">
                    <View className="w-12 h-12 bg-amber-400 rounded-2xl items-center justify-center mb-3 shadow-xl shadow-amber-400/20">
                        <Text className="text-2xl font-extrabold text-slate-900">S</Text>
                    </View>
                    <Text className="text-3xl font-bold text-white tracking-tight mb-2">Servants</Text>
                    <View className="items-center max-w-xs">
                        <Text className="text-zinc-400 text-sm italic text-center leading-relaxed">
                            "No one comes to help, no one comes to contribute, everybody comes to learn and to serve"
                        </Text>
                        <Text className="text-zinc-500 text-xs mt-2 font-medium">— Stephen Tong</Text>
                    </View>
                </Animated.View>

                {/* ── Login Form Card with Slide-up Animation ── */}
                <Animated.View entering={FadeInUp.delay(300).duration(600)} className="w-full max-w-sm bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl">
                    <Text className="text-2xl font-semibold text-white mb-5">Welcome Back</Text>
                    
                    {/* Phone Input */}
                    <View className="mb-5">
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
                    <View className="mb-6">
                        <View className="flex-row items-center justify-between mb-2 px-1">
                            <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Password</Text>
                            <Pressable onPress={() => router.push("/forgot-password")}>
                                <Text className="text-amber-400 text-xs font-semibold">Forgot?</Text>
                            </Pressable>
                        </View>
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

                    {/* Error Message */}
                    {error && (
                        <Animated.View entering={FadeInDown.duration(300)} className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 mb-6 flex-row items-center">
                            <Feather name="alert-circle" size={18} color="#f87171" className="mr-3" />
                            <Text className="text-red-400 text-sm flex-1 font-medium">{error}</Text>
                        </Animated.View>
                    )}

                    {/* Submit Button */}
                    <Pressable
                        onPress={handleLogin}
                        disabled={loading}
                        className={`bg-amber-400 rounded-2xl h-12 items-center justify-center active:scale-[0.98] active:opacity-90 ${loading ? 'opacity-70' : 'opacity-100 mt-2'}`}
                    >
                        <Text className="text-slate-950 text-lg font-bold tracking-wide">
                            {loading ? "Signing in..." : "Sign In"}
                        </Text>
                    </Pressable>

                    <View className="flex-row items-center justify-center mt-6 gap-2">
                        <Text className="text-zinc-400 text-sm">Don't have an account?</Text>
                        <Pressable onPress={() => router.push("/register")}>
                            <Text className="text-amber-400 text-sm font-semibold">Register</Text>
                        </Pressable>
                    </View>
                </Animated.View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
