const { Product } = require("../models");
const { Op } = require("sequelize");

// @desc    Get all products (public, sanitized)
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    // Query param: search, category
    const { search = "", category = "" } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;
    if (search) {
      where.name = { [Op.like]: `%${search.replace(/%/g, "")}%'` };
    }
    const products = await Product.findAll({
      where,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["costPrice"] }, // pastikan tidak ada data sensitif
    });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique product categories (public)
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.findAll({
      where: { isActive: true },
      attributes: [
        [
          Product.sequelize.fn("DISTINCT", Product.sequelize.col("category")),
          "category",
        ],
      ],
      order: [["category", "ASC"]],
    });
    res.status(200).json({
      success: true,
      data: categories.map((c) => c.category).filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, category, img, description, stock } = req.body;

    // Validasi input
    if (!name || !price || !category || !img) {
      return res.status(400).json({
        success: false,
        message: "Nama, harga, kategori, dan gambar harus diisi",
      });
    }

    const product = await Product.create({
      name,
      price,
      category,
      img,
      description,
      stock: stock || 100,
    });

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    await product.update(req.body);

    res.status(200).json({
      success: true,
      message: "Produk berhasil diupdate",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    // Soft delete - set isActive to false
    await product.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
