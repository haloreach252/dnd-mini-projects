const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

let clickCount = 0;
const clients = new Map(); // Map ws => username

wss.on('connection', (ws) => {
	ws.send(JSON.stringify({ type: 'init', count: clickCount }));

	ws.on('message', (message) => {
		const data = JSON.parse(message);

		switch (data.type) {
			case 'register':
				clients.set(ws, data.username);
				broadcast({
					type: 'system',
					message: `${data.username} joined the game.`,
				});
				break;

			case 'click':
				clickCount++;
				broadcast({ type: 'update', count: clickCount });
				break;
		}
	});

	ws.on('close', () => {
		const username = clients.get(ws);
		if (username) {
			broadcast({
				type: 'system',
				message: `${username} left the game.`,
			});
			clients.delete(ws);
		}
	});
});

function broadcast(data) {
	const msg = JSON.stringify(data);
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(msg);
		}
	});
}

console.log('WebSocket server running on ws://localhost:3001');
