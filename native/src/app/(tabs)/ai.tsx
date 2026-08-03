import React, { useState } from "react"
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Message {
    id: string
    text: string
    sender: "user" | "ai"
}

export default function AiTab() {
    const [inputText, setInputText] = useState("")

    // Mock messages for layout demonstration
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "ai",
            text: "Hello! I am ready to help. What would you like to discuss today?"
        },
        {
            id: "2",
            sender: "user",
            text: "Can you help me understand how this layout works?"
        },
        {
            id: "3",
            sender: "ai",
            text: "Certainly! This layout uses a ScrollView to display messages. User messages are right-aligned bubbles, while my responses are left-aligned and span across the screen for easy reading. The input area at the bottom uses a KeyboardAvoidingView so it stays above your keyboard when you type."
        }
    ])

    const handleSend = () => {
        if (!inputText.trim()) return

        // Add user message to demonstrate interactivity visually
        const newUserMessage: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: inputText.trim()
        }

        setMessages((prev) => [...prev, newUserMessage])
        setInputText("")
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View className="border-b border-zinc-100 bg-white px-6 pb-4 pt-12">
                <Text className="text-xl font-bold text-zinc-900">Assistant</Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerClassName="px-4 pt-6 pb-6"
                showsVerticalScrollIndicator={false}
            >
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        className={`mb-8 flex-row ${
                            msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        {msg.sender === "user" ? (
                            <View className="max-w-[85%] rounded-2xl bg-zinc-100 px-5 py-3">
                                <Text className="text-base leading-relaxed text-zinc-900">
                                    {msg.text}
                                </Text>
                            </View>
                        ) : (
                            <View className="w-full px-1">
                                <Text className="text-base leading-relaxed text-zinc-900">
                                    {msg.text}
                                </Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            <View className="border-t border-zinc-100 bg-white px-4 py-3 pb-6">
                <View className="flex-row items-end rounded-[24px] border border-zinc-200 bg-zinc-50 py-1.5 pl-4 pr-2">
                    <TextInput
                        className="max-h-32 flex-1 pb-2 pt-2 text-base text-zinc-900"
                        placeholder="Message..."
                        placeholderTextColor="#a1a1aa"
                        multiline
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <Pressable
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                        className={`mb-0.5 ml-2 rounded-full p-2 ${
                            inputText.trim() ? "bg-zinc-900" : "bg-zinc-200"
                        }`}
                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    >
                        <Ionicons
                            name="arrow-up"
                            size={20}
                            color={inputText.trim() ? "#ffffff" : "#a1a1aa"}
                        />
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
