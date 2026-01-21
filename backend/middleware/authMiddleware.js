const jwt = require("jsonwebtoken");
require("dotenv").config();

// 🔐 JWT Protection
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id || decoded._id || decoded.userId,
            role: decoded.role,
            isAdmin: decoded.isAdmin,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// 🔒 ROLE BASED ACCESS
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied" });
        }
        next();
    };
};

module.exports = {
    protect,
    authorizeRoles,
};
