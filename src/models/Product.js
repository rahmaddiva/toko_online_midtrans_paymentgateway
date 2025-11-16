const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama produk harus diisi",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Harga tidak boleh negatif",
        },
      },
    },
    category: {
      type: DataTypes.ENUM("Pria", "Wanita", "Unisex"),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Kategori harus diisi",
        },
      },
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "URL gambar harus diisi",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue:
        "Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.",
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      validate: {
        min: {
          args: [0],
          msg: "Stok tidak boleh negatif",
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

module.exports = Product;
