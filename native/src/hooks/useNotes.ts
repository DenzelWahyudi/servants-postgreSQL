import { useSQLiteContext } from 'expo-sqlite';

export function useNotes() {
	const db = useSQLiteContext();

	async function getNoteText(color: string): Promise<string> {
		const row = await db.getFirstAsync<{ text: string }>(
			'SELECT text FROM notes WHERE color = ?',
			[color]
		);
		return row?.text ?? '';
	}

	async function saveNoteText(color: string, text: string): Promise<void> {
		await db.runAsync(
			'INSERT OR REPLACE INTO notes (color, text) VALUES (?, ?)',
			[color, text]
		);
	}

	return { getNoteText, saveNoteText };
}
