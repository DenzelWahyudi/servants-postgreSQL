import React, { useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Modal, ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "../../../api";
import { format } from "date-fns";
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface Service {
    _id: string
    name: string
    date: string
    time: string
    status: string
}

interface Role {
    _id: string
    serviceId: string
    name: string
    spotsTotal: number
    spotsFilled: number
}

interface SignUp {
    roleId: string
    serviceName: string
    roleName: string
    date: string
    time: string
}

export default function OpeningsTab() {
    const [services, setServices] = useState<Service[] | null>(null)
    const [roles, setRoles] = useState<Role[] | null>(null)
    const [userId, setUserId] = useState("")
    const { token } = useAuth();
    const [loading, setLoading] = useState(false)

    const [signUpData, setSignUpData] = useState<SignUp | null>(null)
    const [signUpLoading, setSignUpLoading] = useState(false)
    const [signUpError, setSignUpError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            const rolesRes = await fetch(`${API_URL}/api/roles`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const rolesData = await rolesRes.json();
            setRoles(rolesData);

            const servicesRes = await fetch(`${API_URL}/api/services`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const servicesData = await servicesRes.json();
            setServices(servicesData);

            if (token) {
                const userRes = await fetch(`${API_URL}/api/users/id`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                const userData = await userRes.json();
                setUserId(userData);
            }
        } catch (error) {
            console.error("Failed to fetch openings", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchData().finally(() => setLoading(false));
            return () => {}
        }, [token])
    );

    async function handleAssign() {
        if (!signUpData || !userId) return;
        setSignUpError(null);
        setSignUpLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/assignments`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    userId,
                    roleId: signUpData.roleId,
                    status: "pending"
                })
            });

            const data = await response.json();
            if (!response.ok) {
                setSignUpError(data.message || "Sign Up failed!");
                return;
            }

            setSignUpData(null);
            fetchData();
        } catch {
            setSignUpError("Could not connect to server");
        } finally {
            setSignUpLoading(false);
        }
    }

    const openRoles = roles?.filter(role => {
        if (role.spotsFilled >= role.spotsTotal) return false;
        const service = services?.find(s => s._id === role.serviceId && s.status === "Roles Open");
        return !!service;
    }) || [];

    return (
        <View className="flex-1 bg-zinc-50">
            <ScrollView className="flex-1 pt-3" contentContainerClassName="pb-10">
                <View className="px-6 pt-10 pb-6">
                    <Text className="text-3xl font-bold text-zinc-900">
                        Open Roles
                    </Text>
                    <Text className="text-zinc-500 mt-1 font-medium text-base">Find a place to serve</Text>
                </View>

                {loading ? (
                    <View className="py-20 items-center justify-center">
                        <ActivityIndicator size="large" color="#d97706" />
                    </View>
                ) : (
                    <View className="px-6 gap-4">
                        {openRoles.length === 0 ? (
                            <View className="bg-white rounded-3xl p-8 items-center justify-center shadow-sm border border-zinc-100 mt-4">
                                <View className="bg-zinc-100 w-16 h-16 rounded-full items-center justify-center mb-4">
                                    <Feather name="check-circle" size={32} color="#a1a1aa" />
                                </View>
                                <Text className="text-zinc-500 font-medium text-lg text-center">
                                    All roles are filled!
                                </Text>
                            </View>
                        ) : (
                            openRoles.map(role => {
                                const service = services?.find(s => s._id === role.serviceId);
                                if (!service) return null;
                                
                                return (
                                    <View key={role._id} className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100">
                                        <View className="flex-row justify-between items-start mb-4">
                                            <View className="flex-1 mr-4">
                                                <Text className="text-zinc-900 font-bold text-lg mb-1 leading-tight">{service.name}</Text>
                                                <Text className="text-zinc-500 font-medium">{format(new Date(service.date), 'EEEE, d MMMM yyyy')}</Text>
                                            </View>
                                            <View className="bg-zinc-100/80 px-3 py-2 rounded-xl">
                                                <Text className="text-zinc-700 font-bold text-xs">{service.time}</Text>
                                            </View>
                                        </View>

                                        <View className="bg-amber-50 border border-amber-100 px-4 py-3 rounded-2xl mb-5">
                                            <Text className="text-amber-900/60 text-xs font-bold uppercase tracking-wider mb-1">Role Needed</Text>
                                            <Text className="text-amber-900 font-bold text-base">{role.name}</Text>
                                        </View>

                                        <Pressable 
                                            onPress={() => setSignUpData({
                                                roleId: role._id,
                                                serviceName: service.name,
                                                roleName: role.name,
                                                date: format(new Date(service.date), 'd MMMM yyyy'),
                                                time: service.time
                                            })}
                                            className="bg-amber-400 py-2.5 rounded-xl items-center justify-center flex-row"
                                            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                                        >
                                            <Text className="font-bold text-amber-950 text-base">Sign Up</Text>
                                        </Pressable>
                                    </View>
                                )
                            })
                        )}
                    </View>
                )}
            </ScrollView>

            <Modal visible={!!signUpData} transparent animationType="fade" onRequestClose={() => { if (!signUpLoading) setSignUpData(null) }}>
                <View className="flex-1 bg-black/60 justify-center items-center px-6 pb-32">
                    <Pressable 
                        className="absolute inset-0" 
                        onPress={() => { if (!signUpLoading) setSignUpData(null) }} 
                    />
                    <View className="bg-slate-900 w-full rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-800 p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-zinc-50">Sign Up</Text>
                            <Pressable 
                                onPress={() => { if (!signUpLoading) setSignUpData(null) }}
                                className="bg-slate-800 p-2 rounded-full"
                            >
                                <Feather name="x" size={20} color="#a1a1aa" />
                            </Pressable>
                        </View>
                        
                        <View className="gap-4 mb-8">
                            <View>
                                <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1.5 ml-1">Service</Text>
                                <View className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
                                    <Text className="text-zinc-100 font-medium text-base">{signUpData?.serviceName}</Text>
                                </View>
                            </View>
                            <View>
                                <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1.5 ml-1">Role</Text>
                                <View className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
                                    <Text className="text-zinc-100 font-medium text-base">{signUpData?.roleName}</Text>
                                </View>
                            </View>
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1.5 ml-1">Date</Text>
                                    <View className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
                                        <Text className="text-zinc-100 font-medium text-base">{signUpData?.date}</Text>
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1.5 ml-1">Time</Text>
                                    <View className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
                                        <Text className="text-zinc-100 font-medium text-base">{signUpData?.time}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {signUpError && (
                            <View className="bg-rose-500/20 border border-rose-500/30 rounded-xl p-3 mb-6 flex-row items-center">
                                <Feather name="alert-circle" size={16} color="#fb7185" className="mr-2" />
                                <Text className="text-rose-400 text-sm font-medium flex-1 ml-2">{signUpError}</Text>
                            </View>
                        )}

                        <View className="flex-row gap-3">
                            <Pressable 
                                onPress={() => setSignUpData(null)}
                                disabled={signUpLoading}
                                className="flex-1 bg-slate-800 py-3 rounded-xl items-center justify-center border border-slate-700"
                                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                            >
                                <Text className="font-bold text-zinc-300 text-lg">Cancel</Text>
                            </Pressable>
                            <Pressable 
                                onPress={handleAssign}
                                disabled={signUpLoading}
                                className={`flex-1 py-3 rounded-xl items-center justify-center flex-row ${
                                    signUpLoading ? 'bg-amber-500/50' : 'bg-amber-400'
                                }`}
                                style={({ pressed }) => ({ opacity: pressed && !signUpLoading ? 0.8 : 1 })}
                            >
                                {signUpLoading && <ActivityIndicator size="small" color="#451a03" className="mr-2" />}
                                <Text className={`font-bold text-lg ${signUpLoading ? 'text-amber-900/50' : 'text-amber-950'}`}>
                                    {signUpLoading ? "Signing Up..." : "Confirm"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}