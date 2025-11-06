const sqlite3 = require("sqlite3").verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../database/attendify.db');


const userDB = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error opening database:", err, dbPath);
    }
});

module.exports.createUser = (req, res) => {
    const { name, email, password, company, admin } = req.body;

    userDB.run(
        `INSERT INTO users (name, email, password, company, admin) VALUES (?, ?, ?, ?, ?)`,
        [name, email, password, company, admin],
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

module.exports.getUserByEmail = (req, res) => {
    const { email } = req.params;
    console.log("Fetching user with email:", email);
    userDB.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        (err, row) => {
            if (err) {
                console.error("Error fetching user by email:", err);
                res.status(500).send("Error fetching user");
            } else {
                if (!row) {
                    return res.status(200).send({ exist: false });
                }
                res.status(200).send({ user: row, exist: true });
            }
        }
    );
}

module.exports.updateUser = (req, res) => {
    const { id, name, email, company, password } = req.body;

    if (!id || !name || !email || !company) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    if (password) {
        userDB.run(
            `UPDATE users SET name = ?, email = ?, company = ?, password = ? WHERE id = ?`,
            [name, email, company, password, id],
            function (err) {
                if (err) {
                    console.error("Error updating user:", err);
                    return res.status(500).send({ error: "Error updating user" });
                }
                console.log("User updated with ID:", id);
                res.status(200).send({ success: true, message: "User updated successfully" });
            }
        );
    } else {
        userDB.run(
            `UPDATE users SET name = ?, email = ?, company = ? WHERE id = ?`,
            [name, email, company, id],
            function (err) {
                if (err) {
                    console.error("Error updating user:", err);
                    return res.status(500).send({ error: "Error updating user" });
                }
                console.log("User updated with ID:", id);
                res.status(200).send({ success: true, message: "User updated successfully" });
            }
        );
    }
}

module.exports.getEmployeesByCompany = (req, res) => {
    const { company } = req.params;

    userDB.all(
        `SELECT id, name, email, company, admin, status, created_at FROM users WHERE company = ?`,
        [company],
        (err, rows) => {
            if (err) {
                console.error("Error fetching employees:", err);
                return res.status(500).send({ error: "Error fetching employees" });
            }
            res.status(200).send({ employees: rows || [] });
        }
    );
}

module.exports.updateUserStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || (status !== 'accepted' && status !== 'pending')) {
        return res.status(400).send({ error: "Invalid status" });
    }

    userDB.run(
        `UPDATE users SET status = ? WHERE id = ?`,
        [status, id],
        function (err) {
            if (err) {
                console.error("Error updating user status:", err);
                return res.status(500).send({ error: "Error updating status" });
            }
            console.log("User status updated for ID:", id);
            res.status(200).send({ success: true, message: "Status updated successfully" });
        }
    );
}

module.exports.deleteUser = (req, res) => {
    const { id } = req.params;

    userDB.run(
        `DELETE FROM users WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                console.error("Error deleting user:", err);
                return res.status(500).send({ error: "Error deleting user" });
            }
            console.log("User deleted with ID:", id);
            res.status(200).send({ success: true, message: "User deleted successfully" });
        }
    );
}
