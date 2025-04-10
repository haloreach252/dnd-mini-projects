import { useState } from 'react';
import useChatSocket from './hooks/useChatSocket';
import JoinScreen from './components/JoinScreen';
import ChatRoom from './components/ChatRoom';
import OnlineUsers from './components/OnlineUsers';

function rollDice(expression) {
	const match = expression.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
	if (!match) {
		return { total: '❓', breakdown: 'invalid expression' };
	}

	const [_, numStr, sidesStr, modifierStr] = match;
	const num = parseInt(numStr || '1');
	const sides = parseInt(sidesStr);
	const modifier = modifierStr ? parseInt(modifierStr) : 0;

	if (num > 100 || sides > 1000) {
		return { total: '🤯', breakdown: 'too many dice' };
	}

	const rolls = Array.from({ length: num }, () =>
		Math.ceil(Math.random() * sides)
	);
	const total = rolls.reduce((sum, r) => sum + r, 0) + modifier;
	const breakdown = `${rolls.join(' + ')}${
		modifier ? ` ${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)}` : ''
	}`;

	return { total, breakdown };
}

function App() {
	const [username, setUsername] = useState('');
	const [color, setColor] = useState('');
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState([]);
	const [typingUsers, setTypingUsers] = useState([]);
	const [joined, setJoined] = useState(false);
	const [onlineUsers, setOnlineUsers] = useState([]);

	const handleNewMessage = (msg) => setMessages((prev) => [...prev, msg]);

	const { sendMessage, sendTyping } = useChatSocket(
		joined ? username : null,
		color,
		handleNewMessage,
		setTypingUsers,
		setOnlineUsers
	);

	const handleJoin = () => {
		if (username.trim()) {
			setColor(getRandomColor());
			setJoined(true);
		}
	};

	const handleInput = (e) => {
		setInput(e.target.value);
		sendTyping();
	};

	const handleSend = () => {
		const trimmed = input.trim();
		if (!trimmed) return;

		// Handle `/me` command
		if (trimmed.startsWith('/me ')) {
			const emoteText = trimmed.slice(4);
			const msg = {
				id: crypto.randomUUID(),
				username,
				text: `*${username} ${emoteText}*`,
				color,
				type: 'system',
				timestamp: Date.now(),
			};
			sendMessage(msg);
			setInput('');
			return;
		}

		// Handle `/roll` command
		if (trimmed.startsWith('/roll ')) {
			const expr = trimmed.slice(6);
			const result = rollDice(expr); // helper below
			const msg = {
				id: crypto.randomUUID(),
				username,
				text: `🎲 ${username} rolled ${result.total} (${result.breakdown})`,
				color,
				type: 'system',
				timestamp: Date.now(),
			};
			sendMessage(msg);
			setInput('');
			return;
		}

		// Regular message
		sendMessage({
			id: crypto.randomUUID(),
			username,
			text: input,
			color,
			type: 'message',
		});

		setInput('');
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-zinc-900 text-white">
			<div className="flex-1 flex items-center justify-center p-4">
				{!joined ? (
					<JoinScreen
						username={username}
						setUsername={setUsername}
						onJoin={handleJoin}
					/>
				) : (
					<ChatRoom
						messages={messages}
						typingUsers={typingUsers}
						input={input}
						onInputChange={handleInput}
						onSend={handleSend}
					/>
				)}
			</div>

			{joined && <OnlineUsers users={onlineUsers} />}
		</div>
	);
}

function getRandomColor() {
	const colors = [
		'#e63946',
		'#f1fa8c',
		'#06d6a0',
		'#118ab2',
		'#9b5de5',
		'#f4a261',
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

export default App;
