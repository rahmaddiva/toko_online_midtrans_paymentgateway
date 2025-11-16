const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Protect routes - verifikasi JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Cek token dari Authorization header atau cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Jika tidak ada token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login to access this resource",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Cari user berdasarkan ID dari token
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Restrict access berdasarkan role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this resource`,
      });
    }
    next();
  };
};

// Generate JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
