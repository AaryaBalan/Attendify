const sqlite3 = require("sqlite3").verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/attendify.db');

const userDB = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening database:", err, dbPath);
    } else {
        userDB.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                company TEXT NOT NULL,
                admin BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

const movementDB = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening movement database:", err, dbPath);
    } else {
        movementDB.run(`
            CREATE TABLE IF NOT EXISTS movements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                in_time DATETIME default CURRENT_TIMESTAMP,
                out_time DATETIME default NULL,
                date DATE default (DATE('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
    }
});

