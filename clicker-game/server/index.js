const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });
const DATA_PATH = path.join(__dirname, 'data.json');

function loadState() {
	try {
		const data = fs.readFileSync(DATA_PATH, 'utf-8');
		return JSON.parse(data);
	} catch {
		return {
			clickCount: 0,
			gold: 0,
			clickPower: 1,
			autoClickers: 0,
		};
	}
}

function saveState() {
	fs.writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
}

let state = loadState();
const clients = new Map();

function broadcast(data) {
	const msg = JSON.stringify(data);
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(msg);
		}
	});
}

wss.on('connection', (ws) => {
	ws.send(JSON.stringify({ type: 'init', state }));

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
				state.clickCount++;
				state.gold += state.clickPower;
				saveState();
				broadcast({ type: 'update', state });
				break;

			case 'upgrade-click-power':
				if (state.gold >= 50) {
					state.gold -= 50;
					state.clickPower += 1;
					saveState();
					broadcast({ type: 'update', state });
				}
				break;

			case 'upgrade-auto-clicker':
				if (state.gold >= 100) {
					state.gold -= 100;
					state.autoClickers += 1;
					saveState();
					broadcast({ type: 'update', state });
				}
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

// Auto-clicker ticks once per second
setInterval(() => {
	if (state.autoClickers > 0) {
		state.clickCount += state.autoClickers;
		state.gold += state.autoClickers * state.clickPower;
		saveState();
		broadcast({ type: 'update', state });
	}
}, 1000);

console.log('WebSocket server running on ws://localhost:3001');
