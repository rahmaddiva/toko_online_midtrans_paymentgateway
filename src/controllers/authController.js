const { User } = require("../models");
const { generateToken } = require("../middleware/auth");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validasi input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi",
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Buat user baru
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "customer",
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password harus diisi",
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "role",
        "isActive",
        "password",
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Cek apakah akun aktif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Akun Anda tidak aktif. Hubungi admin.",
      });
    }

    // Verifikasi password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Set cookie (optional)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    // Tentukan redirect URL berdasarkan role
    let redirectUrl = "/index.html"; // default untuk customer
    if (user.role === "admin") {
      redirectUrl = "/admin-dashboard.html";
    }

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      redirectUrl,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout berhasil",
      redirectUrl: "/login.html",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
