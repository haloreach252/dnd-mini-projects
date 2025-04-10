// src/components/JoinScreen.jsx
export default function JoinScreen({ username, setUsername, onJoin }) {
	return (
		<div className="bg-zinc-800 p-6 rounded-lg shadow w-full max-w-sm space-y-4">
			<h2 className="text-xl font-semibold">
				Enter your name to join the chat
			</h2>
			<input
				className="w-full px-4 py-2 bg-zinc-700 rounded text-white focus:outline-none focus:ring focus:ring-blue-500"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
			/>
			<button
				onClick={onJoin}
				className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
			>
				Join
			</button>
		</div>
	);
}
