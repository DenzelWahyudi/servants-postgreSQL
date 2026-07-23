import { KeyboardAvoidingView, Pressable, ScrollView, TextInput, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useNotes } from "@/hooks/useNotes";

export default function NotesPage(){
	const { getNoteText, saveNoteText } = useNotes();
	const [page, setPage] = useState<string>("#14213D")
	const [text, setText] = useState<string>("")
	const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pendingSaveRef = useRef<{ color: string; text: string } | null>(null);
	const saveNoteTextRef = useRef(saveNoteText);
	saveNoteTextRef.current = saveNoteText;

	// Load note text when page color changes
	useEffect(function loadNote() {
		// Flush any pending save for the previous page before switching
		if (saveTimerRef.current !== null) {
			clearTimeout(saveTimerRef.current);
			saveTimerRef.current = null;
		}
		if (pendingSaveRef.current !== null) {
			void saveNoteTextRef.current(pendingSaveRef.current.color, pendingSaveRef.current.text);
			pendingSaveRef.current = null;
		}

		getNoteText(page).then(function(savedText) {
			setText(savedText);
		});
	}, [page]);

	// Flush pending save on unmount
	useEffect(function mountCleanup() {
		return () => {
			if (saveTimerRef.current !== null) {
				clearTimeout(saveTimerRef.current);
			}
			if (pendingSaveRef.current !== null) {
				void saveNoteTextRef.current(pendingSaveRef.current.color, pendingSaveRef.current.text);
			}
		};
	}, []);

	function handleTextChange(newText: string) {
		setText(newText);
		pendingSaveRef.current = { color: page, text: newText };

		if (saveTimerRef.current !== null) {
			clearTimeout(saveTimerRef.current);
		}

		saveTimerRef.current = setTimeout(() => {
			void saveNoteTextRef.current(page, newText);
			pendingSaveRef.current = null;
			saveTimerRef.current = null;
		}, 300);
	}
	
	return (
		<View className="flex-1" style={{ backgroundColor: page }}>
			<View className="flex-row items-center justify-evenly pt-[60px] pb-3 px-6 bg-zinc-900">
				<Pressable className={`w-7 h-7 rounded-full border-4 border-[#34559e] ${page === "#14213D" && 'bg-[#34559e]'}`}
				           onPress={() => setPage("#14213D")}
				/>
				<Pressable className={`w-7 h-7 rounded-full border-4 border-[#2cb562] ${page === "#14532D" && 'bg-[#2cb562]'}`}
				           onPress={() => setPage("#14532D")}
				/>
				<Pressable className={`w-7 h-7 rounded-full border-4 border-[#cc3869] ${page === "#7A1F3D" && 'bg-[#cc3869]'}`}
				           onPress={() => setPage("#7A1F3D")}
				/>
				<Pressable className={`w-7 h-7 rounded-full border-4 border-[#667676] ${page === "#2C3333" && 'bg-[#667676]'}`}
				           onPress={() => setPage("#2C3333")}
				/>
				<Pressable className={`w-7 h-7 rounded-full border-4 border-[#8734c6] ${page === "#4B1D6E" && 'bg-[#8734c6]'}`}
				           onPress={() => setPage("#4B1D6E")}
				/>
				<Pressable className={`w-7 h-7 rounded-full border-4 border-[#18adc9] ${page === "#0B4F5C" && 'bg-[#18adc9]'}`}
				           onPress={() => setPage("#0B4F5C")}
				/>
				<Pressable className={`w-7 h-7 rounded-full border-4 border-[#d4623c] ${page === "#8B3A1F" && 'bg-[#d4623c]'}`}
				           onPress={() => setPage("#8B3A1F")}
				/>
			</View>
			<KeyboardAvoidingView
				className="flex-1"
				behavior='padding'
			>
				<ScrollView
					className="flex-1"
				>
						<TextInput
							value={text}
							onChangeText={handleTextChange}
							multiline
							textAlignVertical="top"
							className="px-4 py-3 text-base text-zinc-100"
						/>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	)
}