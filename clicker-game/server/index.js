// External imports
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const bcrypt = require('bcrypt');

// Our stuff
const { getVisibleUpgrades, purchaseUpgrade } = require('./data/upgrades');
const { getCheats, useCheat } = require('./data/cheats');
const { defaultState } = require('./data/defaultState');
const db = require('./db/db');

// Set contants
const shouldReset = false;
const saveStateMillis = 15000;

// Start websocket server
const wss = new WebSocket.Server({ port: 3001 });

// Get our data
const DATA_PATH = path.join(__dirname, 'data.json');

function loadState() {
	if (shouldReset) {
		return defaultState;
	} else {
		try {
			const data = fs.readFileSync(DATA_PATH, 'utf-8');
			return {
				...defaultState,
				...JSON.parse(data),
			};
		} catch {
			return defaultState;
		}
	}
}

// Save our state as needed
function saveState() {
	fs.writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
}

setInterval(() => {
	saveState();
	console.log('🧪 State saved to disk');
}, saveStateMillis); // every 10 seconds

let state = loadState();
const clients = new Map();

function getStateWithCosts() {
	return {
		...state,
		upgrades: getVisibleUpgrades(state),
		cheats: getCheats(),
	};
}

function broadcast(data) {
	const msg = JSON.stringify(data);
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(msg);
		}
	});
}

wss.on('connection', (ws) => {
	ws.send(JSON.stringify({ type: 'init', state: getStateWithCosts() }));

	ws.on('message', (message) => {
		(async () => {
			const data = JSON.parse(message);

			switch (data.type) {
				case 'register-user': {
					const { username, password } = data;
					if (!username || !password) return;

					try {
						const hash = await bcrypt.hash(password, 10);
						db.prepare(
							`INSERT INTO users (username, passwordHash) VALUES (?, ?)`
						).run(username, hash);

						ws.send(JSON.stringify({ type: 'register-success' }));
					} catch (err) {
						ws.send(
							JSON.stringify({
								type: 'register-failure',
								reason: 'Username taken or error',
							})
						);
					}

					break;
				}

				case 'login-user': {
					const { username, password } = data;
					if (!username || !password) return;

					const row = db
						.prepare(`SELECT * FROM users WHERE username = ?`)
						.get(username);
					if (!row) {
						ws.send(
							JSON.stringify({
								type: 'login-failure',
								reason: 'User not found',
							})
						);
						break;
					}

					const match = await bcrypt.compare(
						password,
						row.passwordHash
					);
					if (!match) {
						ws.send(
							JSON.stringify({
								type: 'login-failure',
								reason: 'Incorrect password',
							})
						);
						break;
					}

					const sessionId = crypto.randomUUID();
					db.prepare(
						`INSERT INTO sessions (id, userId) VALUES (?, ?)`
					).run(sessionId, row.id);

					clients.set(ws, username);
					ws.send(
						JSON.stringify({
							type: 'login-success',
							username,
							token: sessionId,
						})
					);
					broadcast({
						type: 'system',
						message: `${username} logged in.`,
					});
					break;
				}

				case 'resume-session': {
					const { token } = data;
					if (!token) return;

					const session = db
						.prepare(
							`
		SELECT users.username FROM sessions
		JOIN users ON users.id = sessions.userId
		WHERE sessions.id = ?
	`
						)
						.get(token);

					if (session) {
						clients.set(ws, session.username);
						ws.send(
							JSON.stringify({
								type: 'login-success',
								username: session.username,
								token,
							})
						);
						broadcast({
							type: 'system',
							message: `${session.username} reconnected.`,
						});
					} else {
						ws.send(
							JSON.stringify({
								type: 'login-failure',
								reason: 'Invalid session token',
							})
						);
					}
					break;
				}

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
					//saveState();
					broadcast({ type: 'update', state: getStateWithCosts() });
					broadcast({
						type: 'action',
						message: `${clients.get(ws) || 'Someone'} clicked (+${
							state.clickPower
						})`,
					});
					break;

				case 'purchase-upgrade': {
					const upgradeName = purchaseUpgrade(
						data.upgradeId,
						state,
						startAutoClickers
					);

					if (!upgradeName) return;

					saveState();
					broadcast({ type: 'update', state: getStateWithCosts() });
					broadcast({
						type: 'action',
						message: `${
							clients.get(ws) || 'Someone'
						} bought "${upgradeName}"`,
					});
					break;
				}

				case 'use-cheat': {
					const cheatName = useCheat(
						data.cheatId,
						state,
						startAutoClickers
					);

					if (!cheatName) return;

					saveState();
					broadcast({ type: 'update', state: getStateWithCosts() });
					broadcast({
						type: 'action',
						message: `${
							clients.get(ws) || 'Someone'
						} used ${cheatName} cheat`,
					});

					break;
				}
			}
		})();
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

let autoClickerTimer = null;

function startAutoClickers() {
	if (autoClickerTimer) clearInterval(autoClickerTimer);

	const interval = state.autoClickerInterval || 1000;

	autoClickerTimer = setInterval(() => {
		if (state.autoClickers > 0) {
			state.clickCount += state.autoClickers;
			state.gold += state.autoClickers * state.clickPower;
			//saveState();
			broadcast({ type: 'update', state: getStateWithCosts() });
			broadcast({
				type: 'action',
				message: `Auto clickers clicked (+${
					state.autoClickers * state.clickPower
				})`,
			});
		}
	}, interval);
}

startAutoClickers();

console.log('WebSocket server running on ws://localhost:3001');
