-- Admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@shopwave.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Sample customer (password: password)
INSERT INTO users (name, email, password_hash, role) VALUES
('Rahul Sharma', 'rahul@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer')
ON CONFLICT (email) DO NOTHING;

-- Electronics
INSERT INTO products (name, description, price, stock, category) VALUES
('iPhone 15 Pro', 'Apple iPhone 15 Pro with A17 chip, 48MP camera, titanium design. 256GB storage.', 134900, 25, 'Electronics'),
('Samsung Galaxy S24', 'Samsung flagship with Snapdragon 8 Gen 3, 200MP camera, AI features.', 79999, 30, 'Electronics'),
('Sony WH-1000XM5', 'Industry leading noise cancelling headphones with 30hr battery life.', 29990, 50, 'Electronics'),
('MacBook Air M3', 'Apple MacBook Air with M3 chip, 16GB RAM, 512GB SSD, 15-inch display.', 149900, 15, 'Electronics'),
('iPad Pro 12.9"', 'Apple iPad Pro with M2 chip, Liquid Retina XDR display, 256GB WiFi.', 112900, 20, 'Electronics');

-- Fashion
INSERT INTO products (name, description, price, stock, category) VALUES
('Nike Air Max 270', 'Nike Air Max 270 running shoes with large Air unit for all-day comfort. Size 7-11.', 12995, 100, 'Fashion'),
('Levi''s 511 Slim Jeans', 'Classic slim fit jeans in authentic denim. Available in multiple washes.', 3499, 200, 'Fashion'),
('Allen Solly Formal Shirt', 'Premium cotton formal shirt for office wear. Wrinkle-resistant fabric.', 1799, 150, 'Fashion'),
('Adidas Ultraboost 22', 'High performance running shoes with BOOST midsole and Primeknit upper.', 14999, 80, 'Fashion'),
('H&M Hoodie', 'Soft cotton blend hoodie with front pocket. Perfect for casual wear.', 1999, 300, 'Fashion');

-- Home & Kitchen
INSERT INTO products (name, description, price, stock, category) VALUES
('Instant Pot Duo 7-in-1', 'Electric pressure cooker that also works as slow cooker, rice cooker, steamer. 6L.', 8999, 40, 'Home & Kitchen'),
('Philips Air Fryer HD9252', 'Rapid Air technology air fryer. Cook with up to 90% less fat. 4.1L capacity.', 7499, 35, 'Home & Kitchen'),
('IKEA KALLAX Shelf', 'Versatile shelf unit that can also be used as a room divider. 4 compartments.', 5999, 20, 'Home & Kitchen'),
('Dyson V12 Detect Slim', 'Cordless vacuum with laser dust detection and LCD screen. 60 min runtime.', 54900, 10, 'Home & Kitchen'),
('Prestige Induction Cooktop', '2000W induction cooktop with 8 preset menus and auto shut-off.', 3299, 60, 'Home & Kitchen');

-- Books
INSERT INTO products (name, description, price, stock, category) VALUES
('Clean Code by Robert Martin', 'A handbook of agile software craftsmanship. Essential reading for every developer.', 699, 500, 'Books'),
('System Design Interview', 'An insider''s guide to system design interviews. Vol 1 & 2 concepts covered.', 899, 400, 'Books'),
('Atomic Habits', 'An easy and proven way to build good habits and break bad ones by James Clear.', 399, 600, 'Books'),
('The Pragmatic Programmer', '20th anniversary edition. Your journey to mastery in software development.', 799, 350, 'Books');

-- Sports
INSERT INTO products (name, description, price, stock, category) VALUES
('Yonex Arcsaber 11 Badminton', 'Professional badminton racket used by top players. Graphite frame, 88g.', 8499, 45, 'Sports'),
('Decathlon Fitness Mat', 'Anti-slip 10mm thick yoga and fitness mat with carry strap. 185x61cm.', 999, 200, 'Sports'),
('Nivia Storm Football', 'FIFA approved match ball. PU material, hand-stitched. Size 5.', 1299, 100, 'Sports');