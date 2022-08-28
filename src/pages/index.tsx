import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

function App() {
	const [greetMsg, setGreetMsg] = useState('');
	const [name, setName] = useState('');

	async function greet() {
		setGreetMsg(await invoke('greet', { name }));
	}

	return <div className="w-screen h-screen bg-gray-600"></div>;
}

export default App;
