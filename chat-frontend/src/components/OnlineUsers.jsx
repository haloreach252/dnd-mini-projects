// src/components/OnlineUsers.jsx
export default function OnlineUsers({ users }) {
	return (
		<div className="w-64 border-l border-zinc-700 p-4 bg-zinc-800">
			<h2 className="font-bold mb-2 text-lg">Online Users</h2>
			<ul className="space-y-1 text-sm text-zinc-300">
				{users.map((user) => (
					<li key={user}>• {user}</li>
				))}
			</ul>
		</div>
	);
}
