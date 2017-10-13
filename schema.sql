DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT(5) NOT NULL,
	product_name VARCHAR(200) NOT NULL,
	department_name VARCHAR(200) NULL,
	price DECIMAL(10,4) NOT NULL,
	stock_quantity INT(10) NULL,
	PRIMARY KEY (item_id)
);
   
SELECT * FROM products;
