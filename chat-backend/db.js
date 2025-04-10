const Database = require('better-sqlite3');
const db = new Database('./chat.db');

// Create messages table if it doesn't exist
db.prepare(
	`
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    username TEXT,
    text TEXT,
    color TEXT,
    timestamp INTEGER,
    type TEXT DEFAULT 'message'
)
`
).run();

function runUpdate() {
	db.prepare(
		`
    ALTER TABLE messages ADD COLUMN type TEXT DEFAULT 'message'
    `
	).run();
}

function saveMessage(message) {
	const stmt = db.prepare(`
    INSERT INTO messages (id, username, text, color, timestamp, type)
    VALUES (@id, @username, @text, @color, @timestamp, @type)
    `);

	stmt.run(message);
}

function getRecentMessages(limit = 50) {
	return db
		.prepare(
			`
    SELECT * FROM messages ORDER BY timestamp DESC LIMIT ?
    `
		)
		.all(limit)
		.reverse(); // Reverse for chronological order
}

module.exports = {
	runUpdate,
	saveMessage,
	getRecentMessages,
};
