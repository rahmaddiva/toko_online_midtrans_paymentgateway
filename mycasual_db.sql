-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 17, 2025 at 07:03 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mycasual_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `orderId` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  `items` json NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `couponCode` varchar(255) DEFAULT NULL,
  `status` enum('pending','settlement','capture','cancel','deny','expire','refund') DEFAULT 'pending',
  `paymentType` varchar(255) DEFAULT NULL,
  `customerName` varchar(255) NOT NULL,
  `customerEmail` varchar(255) NOT NULL,
  `customerPhone` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `orderId`, `userId`, `items`, `subtotal`, `discount`, `total`, `couponCode`, `status`, `paymentType`, `customerName`, `customerEmail`, `customerPhone`, `createdAt`, `updatedAt`) VALUES
(1, 'ORDER-1763306538704-984', 3, '[{\"id\": 1, \"name\": \"Kemeja Kasual Pria UNIQLO\", \"price\": \"189000.00\", \"quantity\": 1}, {\"id\": 2, \"name\": \"Dress Casual Wanita\", \"price\": \"245000.00\", \"quantity\": 1}]', 434000.00, 0.00, 434000.00, NULL, 'pending', NULL, 'Rahmad Diva', 'rahmad.diva@mhs.politala.ac.id', '082251636098', '2025-11-16 15:22:19', '2025-11-16 15:22:19'),
(2, 'ORDER-1763306946963-272', 3, '[{\"id\": 2, \"name\": \"Dress Casual Wanita\", \"price\": \"245000.00\", \"quantity\": 1}]', 245000.00, 0.00, 245000.00, NULL, 'cancel', NULL, 'Rahmad Diva', 'rahmad.diva@mhs.politala.ac.id', '082251636098', '2025-11-16 15:29:07', '2025-11-16 15:29:32'),
(3, 'ORDER-1763307552605-452', 3, '[{\"id\": 2, \"name\": \"Dress Casual Wanita\", \"price\": \"245000.00\", \"quantity\": 1}]', 245000.00, 0.00, 245000.00, NULL, 'cancel', NULL, 'Rahmad Diva', 'rahmad.diva@mhs.politala.ac.id', '082251636098', '2025-11-16 15:39:12', '2025-11-16 15:56:35'),
(4, 'ORDER-1763308972230-79', 3, '[{\"id\": 14, \"name\": \"Bomber Jacket\", \"price\": \"385000.00\", \"quantity\": 1}]', 385000.00, 0.00, 385000.00, NULL, 'settlement', 'bank_transfer', 'Rahmad Diva', 'rahmad.diva@mhs.politala.ac.id', '082251636098', '2025-11-16 16:02:53', '2025-11-16 16:03:12'),
(6, 'ORDER-1763356256160-568', 2, '[{\"id\": 14, \"name\": \"Bomber Jacket\", \"price\": \"385000.00\", \"quantity\": 2}]', 770000.00, 77000.00, 693000.00, 'HEMAT10', 'settlement', 'bank_transfer', 'Customer Test', 'mahendradiva64@gmail.com', '081234567891', '2025-11-17 05:10:56', '2025-11-17 05:11:32'),
(7, 'ORDER-1763356380323-582', 2, '[{\"id\": 2, \"name\": \"Dress Casual Wanita\", \"price\": \"245000.00\", \"quantity\": 1}]', 245000.00, 0.00, 245000.00, NULL, 'settlement', 'bank_transfer', 'Customer Test', 'rahmad.diva@mhs.politala.ac.id', '081234567891', '2025-11-17 05:13:01', '2025-11-17 05:13:21'),
(8, 'ORDER-1763357053772-668', 2, '[{\"id\": 2, \"name\": \"Dress Casual Wanita\", \"price\": \"245000.00\", \"quantity\": 1}, {\"id\": 1, \"name\": \"Kemeja Kasual Pria UNIQLO\", \"price\": \"189000.00\", \"quantity\": 1}]', 434000.00, 0.00, 434000.00, NULL, 'settlement', 'bank_transfer', 'Customer Test', 'mahendradiva64@gmail.com', '081234567891', '2025-11-17 05:24:14', '2025-11-17 05:25:03');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('Pria','Wanita','Unisex') NOT NULL,
  `img` text NOT NULL,
  `description` text,
  `stock` int DEFAULT '100',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category`, `img`, `description`, `stock`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Kemeja Kasual Pria UNIQLO', 189000.00, 'Pria', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 50, 1, '2025-11-16 12:19:49', '2025-11-16 13:08:41'),
(2, 'Dress Casual Wanita', 245000.00, 'Wanita', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 40, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(3, 'Jaket Denim Klasik', 320000.00, 'Unisex', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 30, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(4, 'Kaos Polos Premium', 125000.00, 'Unisex', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 100, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(5, 'Celana Jeans Slim Fit', 275000.00, 'Pria', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 60, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(6, 'Blouse Elegan', 198000.00, 'Wanita', 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 45, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(7, 'Sweater Rajut', 215000.00, 'Unisex', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 35, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(8, 'Rok Mini Modern', 165000.00, 'Wanita', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 50, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(9, 'Hoodie Streetwear', 289000.00, 'Unisex', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 40, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(10, 'Kemeja Flanel', 175000.00, 'Pria', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 55, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(11, 'Cardigan Wanita', 235000.00, 'Wanita', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 30, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(12, 'Celana Chino', 265000.00, 'Pria', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 45, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(13, 'Jumpsuit Casual', 315000.00, 'Wanita', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 25, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(14, 'Bomber Jacket', 385000.00, 'Unisex', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 20, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(15, 'Polo Shirt Premium', 155000.00, 'Pria', 'https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 70, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(16, 'Tunik Batik Modern', 225000.00, 'Wanita', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80', 'Produk fashion berkualitas tinggi dengan bahan premium dan desain modern yang cocok untuk berbagai acara.', 40, 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin My Casual', 'admin@mycasual.id', '$2b$10$cmcO1/MZSjWgxhmkz3T2x.IuvA3yLS6G3ZMWn1V/Oz3AJylYiuxlq', '081234567890', 'admin', 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(2, 'Customer Test', 'mahendradiva64@gmail.com', '$2b$10$WoeWoWgd0RWVha7Ta4R7nORd9iB562rYEOisngB9JA9uB.EYEL33O', '081234567891', 'customer', 1, '2025-11-16 12:19:49', '2025-11-16 12:19:49'),
(3, 'Rahmad Diva', 'rahmad.diva@mhs.politala.ac.id', '$2b$10$IdLMARaz/lzdeJdR/GvW0ev0iIfFrK3V2duFuEGNdXMjuuSEjbHDa', '082251636098', 'customer', 1, '2025-11-16 15:12:30', '2025-11-16 15:12:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderId` (`orderId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
