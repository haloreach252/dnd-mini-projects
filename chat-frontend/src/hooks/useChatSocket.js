import { useEffect, useRef, useState } from 'react';

export default function useChatSocket(
	username,
	color,
	onNewMessage,
	onTypingUsersChange,
	onUserListUpdate
) {
	const [connected, setConnected] = useState(false);
	const ws = useRef(null);
	const typingTimeout = useRef(null);

	useEffect(() => {
		if (!username) return;

		ws.current = new WebSocket('ws://69.162.253.187:3001');

		ws.current.onopen = () => {
			setConnected(true);
			ws.current.send(JSON.stringify({ type: 'join', username }));
			console.log('WebSocket connected');
		};

		ws.current.onmessage = (event) => {
			const message = JSON.parse(event.data);

			if (message.type === 'history') {
				message.messages.forEach(onNewMessage);
			} else if (message.type === 'typing') {
				onTypingUsersChange((prev) =>
					prev.includes(message.username)
						? prev
						: [...prev, message.username]
				);
			} else if (message.type === 'stopTyping') {
				onTypingUsersChange((prev) =>
					prev.filter((name) => name !== message.username)
				);
			} else if (message.type === 'userList') {
				onUserListUpdate?.(message.users);
			} else {
				onNewMessage(message);
				onTypingUsersChange((prev) =>
					prev.filter((name) => name !== message.username)
				);
			}
		};

		ws.current.onclose = () => {
			setConnected(false);
			console.log('WebSocket disconnected');
		};

		return () => {
			ws.current?.close();
		};
	}, [username]);

	const sendMessage = (message) => {
		if (!message.text || typeof message.text !== 'string') return;

		const fullMessage = {
			...message,
			id: message.id || crypto.randomUUID(),
			timestamp: message.timestamp || Date.now(),
		};

		ws.current?.send(JSON.stringify(fullMessage));
	};

	const sendTyping = () => {
		if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

		ws.current.send(JSON.stringify({ type: 'typing', username }));

		clearTimeout(typingTimeout.current);
		typingTimeout.current = setTimeout(() => {
			ws.current.send(JSON.stringify({ type: 'stopTyping', username }));
		}, 2000);
	};

	return {
		connected,
		sendMessage,
		sendTyping,
	};
}
