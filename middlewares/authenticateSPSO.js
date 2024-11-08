const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware xác thực JWT từ cookie
const authenticateTokenSPSO = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Bạn cần đăng nhập để truy cập tài nguyên này." });
    }

    // Kiểm tra và xác thực token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
        }
        if(user.role !== "SPSO") return res.status(403).json({ message: "Không có quyền truy cập vào tài nguyên này." });
        req.user = user;
        next();
    });
};

module.exports = authenticateTokenSPSO;