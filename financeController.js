const pool = require("../db");

exports.addDailyExpense = async (req, res) => {
    const { date, ingredients_cost, other_cost } = req.body;

    const q = `
        INSERT INTO daily_expenses (date, ingredients_cost, other_cost)
        VALUES ($1, $2, $3)
        ON CONFLICT (date)
        DO UPDATE SET ingredients_cost=$2, other_cost=$3
        RETURNING *
    `;

    const result = await pool.query(q, [date, ingredients_cost, other_cost]);
    res.json(result.rows[0]);
};

exports.dailySummary = async (req, res) => {
    const { date } = req.query;

    const orders = await pool.query(
        "SELECT SUM(total_price) AS total_sales FROM orders WHERE DATE(placed_at)=$1",
        [date]
    );

    const expenses = await pool.query(
        "SELECT * FROM daily_expenses WHERE date=$1",
        [date]
    );

    const sales = orders.rows[0].total_sales || 0;
    const expense = expenses.rows[0] || { ingredients_cost: 0, other_cost: 0 };

    const profit = sales - (expense.ingredients_cost + expense.other_cost);

    res.json({ sales, expenses: expense, profit });
};

exports.monthlySummary = async (req, res) => {
    const { month, year } = req.query;

    const orders = await pool.query(
        `SELECT SUM(total_price) AS total FROM orders 
         WHERE EXTRACT(MONTH FROM placed_at)=$1
         AND EXTRACT(YEAR FROM placed_at)=$2`,
        [month, year]
    );

    res.json({ monthly_sales: orders.rows[0].total });
};
