const sqlite3 = require("sqlite3").verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../database/users.db');


const userDB = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening database:", err, dbPath);
    }
});

module.exports.createUser = (req, res) => {
    const { name, email, password, company } = req.body;

    userDB.run(
        `INSERT INTO users (name, email, password, company) VALUES (?, ?, ?, ?)`,
        [name, email, password, company],
        function (err) {
            if (err) {
                console.error("Error creating user:", err);
                res.status(500).send("Error creating user");
            } else {
                console.log("User created with ID:", this.lastID, req.body);
                res.status(201).send({ id: this.lastID });
            }
        }
    );
};
