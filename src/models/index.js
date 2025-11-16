const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");

// Define relationships
User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  User,
  Product,
  Order,
};
