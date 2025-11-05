const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database/attendify.db");
const userDB = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error("Error opening database:", err);
});

function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
}

function logMovement(user_id, in_time, out_time, callback) {
    userDB.run(
        `INSERT INTO movements (user_id, in_time, out_time) VALUES (?, ?, ?)`,
        [user_id, in_time, out_time],
        function (err) {
            if (err) {
                console.error("Error logging movement:", err);
                callback(err);
            } else {
                console.log("Movement logged for user:", user_id);
                callback(null, this.lastID);
            }
        }
    );
}

function updateMovementOutTime(id, callback) {
    const out_time = getCurrentTime();
    userDB.run(
        `UPDATE movements SET out_time = ? WHERE id = ?`,
        [out_time, id],
        function (err) {
            if (err) {
                console.error("Error updating movement:", err);
                callback(err);
            } else {
                console.log("Out time updated for movement ID:", id);
                callback(null);
            }
        }
    );
}

module.exports.getTodayMovementsById = (req, res) => {
    const id = req.params.id;

    userDB.all(
        `SELECT * FROM movements WHERE user_id = ? AND date = DATE('now')`,
        [id],
        (err, rows) => {
            if (err) {
                console.error("Error fetching movements:", err);
                return res.status(500).send("Error fetching movements");
            }

            if (!rows || rows.length === 0) {
                const in_time = getCurrentTime();
                logMovement(id, in_time, null, (err, movementId) => {
                    if (err) return res.status(500).send("Error logging movement");
                    res.status(200).send({ movement: "Checked In", movementId, time: in_time });
                });
            } else {
                const lastMovement = rows[rows.length - 1];
                if (lastMovement.out_time) {
                    return res.status(200).send({ movement: "Already Checked Out" });
                }

                updateMovementOutTime(lastMovement.id, (err) => {
                    if (err) return res.status(500).send("Error updating out time");
                    res.status(200).send({ movement: "Checked Out", time: getCurrentTime() });
                });
            }
        }
    );
};

module.exports.getTodayStatusById = (req, res) => {
    const id = req.params.id;

    userDB.get(
        `SELECT * FROM movements WHERE user_id = ? AND date = DATE('now') ORDER BY id DESC LIMIT 1`,
        [id],
        (err, row) => {
            if (err) {
                console.error("Error fetching today's status:", err);
                return res.status(500).send("Error fetching status");
            }

            if (!row) {
                return res.status(200).send({ status: "Not Checked In" });
            } else if (row && !row.out_time) {
                return res.status(200).send({ status: "Checked In", in_time: row.in_time });
            } else {
                return res.status(200).send({ status: "Checked Out", in_time: row.in_time, out_time: row.out_time });
            }
        }
    );
}

module.exports.getMovementsByFilter = (req, res) => {
    const { filter, company } = req.params;
    let dateFilter = '';

    switch (filter) {
        case 'today':
            dateFilter = `DATE('now')`;
            break;
        case 'yesterday':
            dateFilter = `DATE('now', '-1 day')`;
            break;
        case 'week':
            dateFilter = `DATE('now', '-7 days')`;
            break;
        case 'month':
            dateFilter = `DATE('now', '-1 month')`;
            break;
        case 'year':
            dateFilter = `DATE('now', '-1 year')`;
            break;
        default:
            dateFilter = `DATE('now')`;
    }

    let query = '';
    if (filter === 'today' || filter === 'yesterday') {
        query = `
            SELECT m.*, u.name, u.email 
            FROM movements m
            JOIN users u ON m.user_id = u.id
            WHERE u.company = ? AND m.date = ${dateFilter}
            ORDER BY m.date DESC, m.in_time DESC
        `;
    } else {
        query = `
            SELECT m.*, u.name, u.email 
            FROM movements m
            JOIN users u ON m.user_id = u.id
            WHERE u.company = ? AND m.date >= ${dateFilter}
            ORDER BY m.date DESC, m.in_time DESC
        `;
    }

    userDB.all(query, [company], (err, rows) => {
        if (err) {
            console.error("Error fetching movements:", err);
            return res.status(500).send({ error: "Error fetching movements" });
        }

        return res.status(200).send({ movements: rows || [] });
    });
}
