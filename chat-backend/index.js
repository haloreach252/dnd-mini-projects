// chat-backend/index.js
const WebSocket = require('ws');
const { runUpdate, saveMessage, getRecentMessages } = require('./db');

const wss = new WebSocket.Server({ port: 3001 });
const onlineUsers = new Map();

// Update the function and uncomment this to run a DB migration (better system will come in the future)
//runUpdate();

wss.on('connection', (ws) => {
	console.log('New client connected');

	// Send last 50 messages on connect
	const history = getRecentMessages(50);
	ws.send(JSON.stringify({ type: 'history', messages: history }));

	ws.on('message', (message) => {
		const text = message.toString();
		let data;

		try {
			data = JSON.parse(text);
		} catch (err) {
			console.error('Invalid JSON:', text);
			return;
		}

		if (data.type === 'join') {
			onlineUsers.set(ws, data.username);
			broadcastUserList();
			return;
		}

		// Save and broadcast chat messages
		if (data.text && data.username) {
			const fullMessage = {
				...data,
				timestamp: Date.now(),
			};

			saveMessage(fullMessage);

			// Broadcast to all clients
			wss.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(fullMessage));
				}
			});
		}

		// Forward typing events as-is
		if (data.type === 'typing' || data.type === 'stopTyping') {
			wss.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(text);
				}
			});
		}
	});

	ws.on('close', () => {
		onlineUsers.delete(ws);
		broadcastUserList();
		console.log('Client disconnected');
	});
});

function broadcastUserList() {
	const usernames = [...onlineUsers.values()];
	const msg = JSON.stringify({ type: 'userList', users: usernames });

	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(msg);
		}
	});
}
