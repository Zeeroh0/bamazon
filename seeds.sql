DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT(5) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(200) NOT NULL,
	department_name VARCHAR(200) NULL,
	price DECIMAL(10,4) NOT NULL,
	stock_quantity INT(10) NULL,
	PRIMARY KEY (item_id)
);

 
INSERT INTO products 
(product_name, department_name, price, stock_quantity)
VALUES 
("Vintage Yo-Yo", "Toys", 25.00, 5),
-- ("New Vacuum", "Appliances", 40.00, 1),
-- ("Knife Set", "Kitchen", 94.99, 7),
-- ("Car Tires", "Auto Parts", 139.00, 8),
-- ('60" TV', "Electronics", 499.95, 3),
-- ("Electric Drill", "Tools", 60.00, 20),
-- ("Spider-Man #1", "Comic Book", 425.00, 1),
-- ('Macbook Pro Retina 2015 13"', "Electronics", 750.00, 5),
("Pixel 2", "Electronics", 949.00, 3),
("Tesla Model S", "Automobile", 122500.00, 1);

SELECT * FROM products;
