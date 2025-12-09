const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const financeRoutes = require("./routes/finance");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Phoenix Delight Backend Running"));

app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/finance", financeRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT);
});
