const { sequelize, connectDB } = require("../config/database");
const { User, Product } = require("../models");
require("dotenv").config();

const seedData = async () => {
  try {
    await connectDB();

    // Drop dan buat ulang tabel (HATI-HATI: ini akan menghapus semua data!)
    await sequelize.sync({ force: true });
    console.log("Database tables created");

    // Create admin user
    const admin = await User.create({
      name: "Admin My Casual",
      email: "admin@mycasual.id",
      password: "admin123",
      phone: "081234567890",
      role: "admin",
    });

    // Create sample customer
    const customer = await User.create({
      name: "Customer Test",
      email: "customer@test.com",
      password: "customer123",
      phone: "081234567891",
      role: "customer",
    });

    // Create sample products
    const products = await Product.bulkCreate([
      {
        name: "Kemeja Kasual Pria",
        price: 189000,
        category: "Pria",
        img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
        stock: 50,
      },
      {
        name: "Dress Casual Wanita",
        price: 245000,
        category: "Wanita",
        img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
        stock: 40,
      },
      {
        name: "Jaket Denim Klasik",
        price: 320000,
        category: "Unisex",
        img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
        stock: 30,
      },
      {
        name: "Kaos Polos Premium",
        price: 125000,
        category: "Unisex",
        img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
        stock: 100,
      },
      {
        name: "Celana Jeans Slim Fit",
        price: 275000,
        category: "Pria",
        img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
        stock: 60,
      },
      {
        name: "Blouse Elegan",
        price: 198000,
        category: "Wanita",
        img: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&q=80",
        stock: 45,
      },
      {
        name: "Sweater Rajut",
        price: 215000,
        category: "Unisex",
        img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80",
        stock: 35,
      },
      {
        name: "Rok Mini Modern",
        price: 165000,
        category: "Wanita",
        img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80",
        stock: 50,
      },
      {
        name: "Hoodie Streetwear",
        price: 289000,
        category: "Unisex",
        img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        stock: 40,
      },
      {
        name: "Kemeja Flanel",
        price: 175000,
        category: "Pria",
        img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80",
        stock: 55,
      },
      {
        name: "Cardigan Wanita",
        price: 235000,
        category: "Wanita",
        img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
        stock: 30,
      },
      {
        name: "Celana Chino",
        price: 265000,
        category: "Pria",
        img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
        stock: 45,
      },
      {
        name: "Jumpsuit Casual",
        price: 315000,
        category: "Wanita",
        img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80",
        stock: 25,
      },
      {
        name: "Bomber Jacket",
        price: 385000,
        category: "Unisex",
        img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
        stock: 20,
      },
      {
        name: "Polo Shirt Premium",
        price: 155000,
        category: "Pria",
        img: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=500&q=80",
        stock: 70,
      },
      {
        name: "Tunik Batik Modern",
        price: 225000,
        category: "Wanita",
        img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80",
        stock: 40,
      },
    ]);

    console.log("\n✅ Data seeded successfully!");
    console.log("\n--- Login Credentials ---");
    console.log("👨‍💼 Admin:");
    console.log("Email: admin@mycasual.id");
    console.log("Password: admin123");
    console.log("\n👤 Customer:");
    console.log("Email: customer@test.com");
    console.log("Password: customer123");
    console.log(`\n📦 ${products.length} products created`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
