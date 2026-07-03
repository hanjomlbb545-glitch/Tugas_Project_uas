CREATE DATABASE IF NOT EXISTS uas_ecommerce;
USE uas_ecommerce;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Menggunakan varchar panjang untuk hash bcrypt/plain text aman
    role ENUM('buyer', 'seller') NOT NULL, -- Pembeda hak akses (Otorisasi)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    seller_id INT, -- Menghubungkan produk ke penjualnya
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    buyer_id INT, -- Menghubungkan transaksi ke pembeli
    quantity INT NOT NULL,
    status ENUM('pending', 'terjual') DEFAULT 'terjual',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, password, role) VALUES 
('penjual1', '	', 'seller'),
('pembeli1', 'password123', 'buyer');

INSERT INTO products (name, price, stock, seller_id) VALUES
('Laptop Asus ROG', 15000000, 5, 1),
('Mouse Gaming Logitech', 350000, 20, 1),
('Keyboard Mechanical', 750000, 12, 1);