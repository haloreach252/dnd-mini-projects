const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'users.db'));

// Run on startup
db.prepare(
	`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`
).run();

module.exports = db;
