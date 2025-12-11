const pool = require("../db");

exports.placeOrder = async (req, res) => {
    try {
        const user_name = req.body.user_name; // employee selects name
        const { items } = req.body;

        let total = 0;

        for (const it of items) {
            const priceRes = await pool.query("SELECT price FROM menu_items WHERE id=$1", [it.menu_item_id]);
            total += priceRes.rows[0].price * it.quantity;
        }

        const orderRes = await pool.query(
            "INSERT INTO orders (user_name, total_price) VALUES ($1, $2) RETURNING id",
            [user_name, total]
        );

        const orderId = orderRes.rows[0].id;

        for (const it of items) {
            await pool.query(
                "INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
                [orderId, it.menu_item_id, it.quantity, it.unit_price]
            );
        }

        res.json({ orderId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.myOrders = async (req, res) => {
    const user_name = req.query.user_name;
    const q = "SELECT * FROM orders WHERE user_name=$1 ORDER BY id DESC";
    const result = await pool.query(q, [user_name]);
    res.json(result.rows);
};

exports.todayOrders = async (req, res) => {
    const q = `
        SELECT * FROM orders
        WHERE DATE(placed_at) = CURRENT_DATE
        ORDER BY id DESC
    `;
    const result = await pool.query(q);
    res.json(result.rows);
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const q = "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *";
    const result = await pool.query(q, [status, id]);
    res.json(result.rows[0]);
};
