import { Pressable, View } from "react-native";
import { useState } from "react";

export default function NotesPage(){
	const [page, setPage] = useState<string>("#14213D")
	
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
		</View>
	)
}