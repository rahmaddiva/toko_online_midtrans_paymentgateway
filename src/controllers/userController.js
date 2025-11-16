const { User } = require("../models");
const { generateToken } = require("../middleware/auth");

// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin only
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin only
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, role, isActive } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Update user data
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User berhasil diperbarui",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin only
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Prevent deleting admin user if it's the only one
    if (user.role === "admin") {
      const adminCount = await User.count({ where: { role: "admin" } });
      if (adminCount === 1) {
        return res.status(400).json({
          success: false,
          message: "Tidak bisa menghapus admin terakhir",
        });
      }
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
