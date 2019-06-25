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
        choices: ["View all products for sale", "View low inventory", "Add to inventory", "Add a new product", "Exit"]
      }])
      .then(function(answer) {
        switch (answer.action) {
            case "View all products for sale":
                return viewProducts();
            case "View low inventory":
                return lowInventory();
            case "Add to inventory":
                return addInventory();
            case "Add a new product":
                return addProduct();
            case "Exit":
                con.end();
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
        start();
    });
}

function addInventory() {
    con.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        var productChoiceList = [];
        for (i = 0; i < result.length; i++) {
        var itemNums = result[i].item_id;
        productChoiceList.push(itemNums);

        }
    inquirer
        .prompt([
        {
            name: "productChoice",
            type: "list",
            message: "To which product would you like to add inventory?",
            choices: productChoiceList
        },
        {
            name: "quantity",
            type: "number",
            message: "How many would you like to add?",
            validate: function(value) {
                if (Number.isInteger(value) && value > 0) {
                return true;
                }
                return false;
            }
        }])
        .then(function(answer) {
        var userChoice = result[parseInt(answer.productChoice) - 1];
        var userQty = parseInt(answer.quantity);
    
        // update database with new quantity, confirm order & give user total price
        con.query("UPDATE products SET ? WHERE ?", [
            {
            stock_quantity: (userChoice.stock_quantity + userQty)
            },
            {
            item_id: userChoice.item_id
            }
        ], function(err, result) {
            if (err) throw err;
            console.log("\n" + result.affectedRows + " product updated");
            console.log("Inventory level of " + userChoice.product_name + ": " + (userChoice.stock_quantity + userQty));
            start();
        });
        });
    });
}
    
function addProduct() {
    inquirer
        .prompt([
        {
            name: "product",
            type: "input",
            message: "What product would you like to add?"
        },
        {
            name: "dept",
            type: "input",
            message: "Which department should this be added to?"
        },
        {
            name: "price",
            type: "number",
            message: "What is the retail price of this item?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "number",
            message: "How many do you want to stock?",
            validate: function(value) {
                if (Number.isInteger(value) && value > 0) {
                    return true;
                }
                return false;
            }
        }
        ])
        .then(function(answer) {
            var query = "INSERT INTO products SET ?";
            var values = {
                product_name: answer.product,
                department_name: answer.dept,
                retail_price: parseFloat(answer.price.toFixed(2)),
                stock_quantity: parseInt(answer.quantity)
            };
            // update database with new item
            con.query(query, values, function(err, result) {
                if (err) throw err;
                console.log("\n" + result.affectedRows + " product added successfully");
                start();

            });
    });
}