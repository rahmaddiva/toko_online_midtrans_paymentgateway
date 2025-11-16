const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    items: {
      type: DataTypes.JSON, // Menyimpan array items dalam JSON
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    couponCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "settlement",
        "capture",
        "cancel",
        "deny",
        "expire",
        "refund"
      ),
      defaultValue: "pending",
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

module.exports = Order;
