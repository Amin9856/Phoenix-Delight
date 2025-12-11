const pool = require("../db");

exports.getMenu = async (req, res) => {
    const result = await pool.query("SELECT * FROM menu_items WHERE available = true");
    res.json(result.rows);
};

exports.addItem = async (req, res) => {
    const { name, price, date } = req.body;
    const q = `
        INSERT INTO menu_items (name, price, date)
        VALUES ($1, $2, $3) RETURNING *
    `;
    const result = await pool.query(q, [name, price, date]);
    res.json(result.rows[0]);
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, price, available } = req.body;

    const q = `
        UPDATE menu_items
        SET name=$1, price=$2, available=$3
        WHERE id=$4 RETURNING *
    `;
    const result = await pool.query(q, [name, price, available, id]);
    res.json(result.rows[0]);
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM menu_items WHERE id=$1", [id]);
    res.json({ success: true });
};
