var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
    // enter your user & password
    user: 'root',
    password: 'password',
    database: 'bamazon_db',
    host: 3306
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    start();
});


function start() {
    inquirer
      .prompt([
        {
        name: "action",
        type: "list",
        message: "Manage your Bamazon store inventory. What do you want to do?",
        choices: ["View all products for sale", "View low inventory", "Add to inventory", "Add a product"]
      }])
      .then(function(answer) {
        switch (answer.action) {
            case "View all products for sale":
                viewProducts();
                break;
            case "View low inventory":
                lowInventory();
                break;
            case "Add to inventory":
                addInventory();
            case "Add a product":
                addProduct();
                break;
        }
    })
};

function viewProducts() {
    // query database. Then loop through result to list all items for sale
    con.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        console.log("Items for sale in your Bamazon store are:")
        for (i = 0; i < result.length; i++) {
          console.log("Item ID: " + result[i].item_id + ", Product: " + result[i].product_name + ", Department: " + result[i].department_name + ", Price: $" + result[i].retail_price + ", Inventory: " + result[i].stock_quantity +"\n")
        }
        start();
    });
}

function lowInventory() {
    // query database using BETWEEN to get range of items with stock for 0 to 5
    con.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity BETWEEN 0 AND 5", function (err, result) {
        if (err) throw err;
        console.log("Low inventory items:");
        for (i = 0; i < result.length; i++) {
            console.log("Item ID: " + result[i].item_id + ", Product: " + result[i].product_name + ", Inventory: " + result[i].stock_quantity +"\n")
        }
    })
}

function addInventory() {
    
}


