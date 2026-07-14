import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isEqual,
    isSameMonth,
    isToday,
    parse,
    startOfDay,
    startOfToday,
    startOfWeek,
} from "date-fns"
import { Feather } from '@expo/vector-icons';
import { capitalizeFirstLetter } from "@/utils/functions";
import React, { useState, useCallback } from "react"
import { View, Text, Pressable, ScrollView, Modal, ActivityIndicator } from 'react-native'
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "../../../api";
import { useFocusEffect } from 'expo-router'

interface Schedule {
    roleName: string
    serviceName: string
    date: Date
    time: string
}

export default function ScheduleTab() {
    const { token } = useAuth()
    const [schedule, setSchedule] = useState<Schedule[] | null>(null)
    const [roleInfo, setRoleInfo] = useState<Schedule | null>(null)
    const [chosenSchedule, setChosenSchedule] = useState<Schedule[] | null>(null)
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            async function fetchSchedule() {
                setLoading(true)
                try {
                    const response = await fetch(`${API_URL}/api/assignments/schedule`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    })
                    const data = await response.json()
                    setSchedule(Array.isArray(data) ? data : [])
                } catch (error) {
                    console.error("Failed to fetch schedule", error)
                } finally {
                    setLoading(false)
                }
            }
            if (token) {
                void fetchSchedule()
            }
            return () => {}
        }, [token])
    )

    const today = startOfToday()
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

    const [currMonth, setCurrMonth] = useState(() => format(today, "MMM-yyyy"))
    const firstDayOfMonth = parse(currMonth, "MMM-yyyy", new Date())

    const daysInMonth = eachDayOfInterval({
        start: startOfWeek(firstDayOfMonth),
        end: endOfWeek(endOfMonth(firstDayOfMonth))
    })

    const getPrevMonth = () => {
        const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 })
        setCurrMonth(format(firstDayOfPrevMonth, "MMM-yyyy"))
    }

    const getNextMonth = () => {
        const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 })
        setCurrMonth(format(firstDayOfNextMonth, "MMM-yyyy"))
    }

    const selectDay = (day: Date) => {
        const selected = schedule?.filter((s) => isEqual(
            startOfDay(new Date(s.date)),
            startOfDay(day)
        ))
        
        if (selected && selected.length > 0) {
            setChosenSchedule(selected)
        } else {
            setChosenSchedule(null)
        }
    }

    return (
        <ScrollView className="flex-1 bg-zinc-50 pt-3" contentContainerClassName="pb-10">
            <View className="px-6 pt-10 pb-6">
                <Text className="text-3xl font-bold text-zinc-900">
                    My Schedule
                </Text>
                <Text className="text-zinc-500 mt-1 font-medium text-base">Keep track of your serving dates</Text>
            </View>

            <View className="px-6">
                <View className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="font-bold text-xl text-zinc-900">
                            {format(firstDayOfMonth, "MMMM yyyy")}
                        </Text>
                        <View className="flex-row items-center gap-4">
                            <Pressable 
                                onPress={getPrevMonth}
                                className="p-2 bg-zinc-50 rounded-full active:bg-zinc-100"
                            >
                                <Feather name="chevron-left" size={20} color="#3f3f46" />
                            </Pressable>
                            
                            <Pressable 
                                onPress={() => setCurrMonth(format(today, "MMM-yyyy"))}
                                className={`px-3 py-1.5 rounded-full ${currMonth === format(today, "MMM-yyyy") ? "bg-amber-100" : "bg-zinc-50"}`}
                            >
                                <Text className={`font-semibold text-sm ${currMonth === format(today, "MMM-yyyy") ? "text-amber-700" : "text-zinc-600"}`}>
                                    Today
                                </Text>
                            </Pressable>
                            
                            <Pressable 
                                onPress={getNextMonth}
                                className="p-2 bg-zinc-50 rounded-full active:bg-zinc-100"
                            >
                                <Feather name="chevron-right" size={20} color="#3f3f46" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Days of week */}
                    <View className="flex-row justify-between mb-2">
                        {days.map((day, idx) => (
                            <View key={idx} className="flex-1 items-center">
                                <Text className="text-zinc-400 font-bold text-xs uppercase tracking-wider">
                                    {capitalizeFirstLetter(day)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View className="h-px bg-zinc-100 mb-3" />

                    {/* Loading Indicator */}
                    {loading ? (
                        <View className="h-64 items-center justify-center">
                            <ActivityIndicator size="large" color="#fbbf24" />
                        </View>
                    ) : (
                        /* Calendar Grid */
                        <View className="flex-row flex-wrap">
                            {daysInMonth.map((day, idx) => {
                                const isCurrentMonth = isSameMonth(day, firstDayOfMonth)
                                const isCurrentToday = isToday(day)
                                const daySchedules = schedule?.filter((s) => isEqual(startOfDay(new Date(s.date)), startOfDay(day)))
                                const hasSchedules = daySchedules && daySchedules.length > 0
                                
                                return (
                                    <View key={idx} style={{ width: '14.28%' }} className="aspect-square p-1">
                                        <Pressable
                                            onPress={() => selectDay(day)}
                                            className={`flex-1 items-center justify-center rounded-2xl ${
                                                isCurrentToday ? "bg-amber-400" : 
                                                hasSchedules ? "bg-amber-50" : "bg-transparent"
                                            }`}
                                            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                                        >
                                            <Text 
                                                className={`text-base font-medium ${
                                                    isCurrentToday ? "text-amber-950 font-bold" :
                                                    !isCurrentMonth ? "text-zinc-300" :
                                                    hasSchedules ? "text-amber-700 font-bold" : "text-zinc-700"
                                                }`}
                                            >
                                                {format(day, "d")}
                                            </Text>
                                            {hasSchedules && !isCurrentToday && (
                                                <View className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" />
                                            )}
                                            {hasSchedules && isCurrentToday && (
                                                <View className="w-1.5 h-1.5 rounded-full bg-amber-900 mt-1" />
                                            )}
                                        </Pressable>
                                    </View>
                                )
                            })}
                        </View>
                    )}
                </View>
            </View>

            {/* Selected Day Schedules */}
            {chosenSchedule && chosenSchedule.length > 0 && (
                <View className="px-6 mt-6">
                    <Text className="text-xl font-bold text-zinc-900 mb-4">
                        {format(new Date(chosenSchedule[0].date), 'EEEE, dd MMMM yyyy')}
                    </Text>
                    <View className="gap-4">
                        {chosenSchedule.map((s, idx) => (
                            <Pressable 
                                key={idx} 
                                className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100 flex-row items-center"
                                onPress={() => setRoleInfo(s)}
                            >
                                <View className="bg-amber-100 w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                    <Feather name="calendar" size={24} color="#d97706" />
                                </View>
                                <View className="flex-1 mr-4">
                                    <Text className="text-zinc-900 font-bold text-lg mb-1 leading-tight">{s.serviceName}</Text>
                                    <Text className="text-zinc-500 font-medium">{s.roleName}</Text>
                                </View>
                                <View className="bg-zinc-100 px-3 py-2 rounded-xl">
                                    <Text className="text-zinc-700 font-bold text-xs">{s.time}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}

            {/* Role Info Modal */}
            <Modal visible={!!roleInfo} transparent animationType="fade" onRequestClose={() => setRoleInfo(null)}>
                <View className="flex-1 bg-black/60 justify-center items-center px-6">
                    <Pressable 
                        className="absolute inset-0" 
                        onPress={() => setRoleInfo(null)} 
                    />
                    <View className="bg-white w-full rounded-3xl overflow-hidden shadow-2xl relative z-10 p-6">
                        <View className="flex-row justify-between items-start mb-6">
                            <View className="bg-amber-100 w-12 h-12 rounded-2xl items-center justify-center">
                                <Feather name="info" size={24} color="#d97706" />
                            </View>
                            <Pressable 
                                onPress={() => setRoleInfo(null)}
                                className="bg-zinc-100 p-2 rounded-full"
                            >
                                <Feather name="x" size={20} color="#52525b" />
                            </Pressable>
                        </View>
                        
                        <Text className="text-2xl font-bold text-zinc-900 mb-2">
                            {roleInfo?.serviceName}
                        </Text>
                        <Text className="text-zinc-500 font-medium mb-6">
                            {roleInfo && format(new Date(roleInfo.date), 'EEEE, dd MMMM yyyy')}
                        </Text>
                        
                        <View className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 mb-4">
                            <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1">Role</Text>
                            <Text className="text-zinc-800 font-semibold text-lg">{roleInfo?.roleName}</Text>
                        </View>
                        
                        <View className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                            <Text className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1">Time</Text>
                            <Text className="text-zinc-800 font-semibold text-lg">{roleInfo?.time}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

