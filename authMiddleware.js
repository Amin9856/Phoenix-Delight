const jwt = require("jsonwebtoken");

module.exports = (roleRequired = null) => {
    return (req, res, next) => {
        const token = req.headers["authorization"];
        if (!token) return res.status(401).json({ error: "No token provided" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roleRequired && decoded.role !== roleRequired)
                return res.status(403).json({ error: "Not allowed" });

            next();
        } catch (err) {
            res.status(401).json({ error: "Invalid token" });
        }
    };
};
