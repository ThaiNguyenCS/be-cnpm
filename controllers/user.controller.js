const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const sendMail = require('../utils/sendMail.js');
dotenv.config();

const COOKIE_OPTION = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    path: "/",
};

const register = async (req, res) => {
    try {
        const { fullName, email, password, role, uniId } = req.body;

        // Check existing email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            id: uuidv4(), // Random ID
            fullName,
            email,
            uniId,
            password: hashedPassword,
            role: role || "student",
        });

        // Create JWT token
        const token = jwt.sign(
            {
                id: newUser.id,
                fullName: newUser.fullName,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Save MySQL
        newUser.token = token;
        await newUser.save();

        // Set cookie
        res.cookie("token", token, COOKIE_OPTION);

        res.status(201).json({
            message: "Đăng ký thành công!",
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
                uniId: newUser.uniId,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra.", error: error.message });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        // Check Email
        if (!user) {
            return res.status(400).json({ message: "Email đăng nhập không chính xác." });
        }
        // Check Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Sai mật khẩu." });
        }
        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                fullName: user.fullName,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        // Save JWT token
        user.token = token;
        await user.save();
        // Set cookie
        res.cookie("token", token, COOKIE_OPTION);

        res.status(200).json({
            message: "Đăng nhập thành công!",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                uniId: user.uniId,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Có lỗi xảy ra.", error: error.message });
    }
};
const getUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: ["id", "fullName", "email", "role", "numberPage", "uniId"], // Chỉ lấy các trường cần thiết
        });

        if (!user) {
            return res.status(404).json({ status: "failed", message: "Người dùng không tồn tại." });
        }

        res.status(200).json({
            status: "success",
            message: "Lấy thông tin người dùng thành công!",
            user,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Có lỗi xảy ra.", error: error.message });
    }
};
const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Đăng xuất thành công!" });
};

const forgetPassword = async (req, res) => {
  if (!req.body.email) {
    res.json({
      "code": "error",
      "msg": "Vui lòng điền email của bạn."
    });
    return;
  }

  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      res.json({
        "code": "error", "msg": "Email không tồn tại."
      });
      return;
    }

    const subject = "Khôi phục mật khẩu";
    const text = `${user.password}`;
    await sendMail(req.body.email, subject, text);

    res.json({
      "code": "success",
      "msg": "Đã gửi mật khẩu thành công"
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({
      "code": "error",
      "msg": "Có lỗi xảy ra, vui lòng thử lại sau."
    });
  }
};

module.exports = {
    register,
    login,
    getUser,
    logout,
    forgetPassword,
};
