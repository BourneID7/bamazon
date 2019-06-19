DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(30),
  retail_price DECIMAL(6, 2) NOT NULL,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("Apple Picker", "Lawn & Garden", 9.95, 5);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("Mulch 20lb Bag", "Lawn & Garden", 13.75, 10);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("Garden Shears", "Lawn & Garden", 7.99), 25;

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("St. Trinian's DVD", "Movies and Music", 9.99, 4);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("The Best Exotic Marigold Hotel DVD", "Movies and Music", 10.99, 10);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("Levi's Women's 505 Denim Jeans", "Clothing", 41.95, 30);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("Men's Hoodie Sweatshirt", "Clothing", 25, 17);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("Chromecast", "Electronics", 29.99, 15);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("Cuisinart Coffee Maker", "Kitchen", 33.95, 6);

INSERT INTO products (product_name, department_name, retail_price, stock_quantity)
VALUES ("Shark Vacuum Cleaner", "Appliances", 165, 10);
