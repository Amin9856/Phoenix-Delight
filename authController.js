const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const q = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role
        `;
        const result = await pool.query(q, [name, email, hash, role || "user"]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userRes = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (userRes.rowCount === 0)
            return res.status(400).json({ error: "User not found" });

        const user = userRes.rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) return res.status(400).json({ error: "Wrong password" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
