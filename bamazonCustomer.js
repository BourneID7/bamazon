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

    // query database. Then loop through result to list all items for sale
    con.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        console.log("Welcome to Bamazon. Items for sale are:")
        for (i = 0; i < result.length; i++) {
          console.log("Item ID: " + result[i].item_id + ", Product: " + result[i].product_name + ", Department: " + result[i].department_name + ", Price: $" + result[i].retail_price + "\n")
        }
        start();
    });
});

function start() {
  con.query("SELECT * FROM products", function (err, result) {
    if (err) throw err;
    inquirer
      .prompt([
        {
        name: "productChoice",
        type: "list",
        message: "Which Item ID would you like to buy?",
        choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
      {
        name: "quantity",
        type: "number",
        message: "How many would you like?",
        validate: function(value) {
          if (isNaN(value) === false && Number.isInteger(value)) {
            return true;
          }
          return false;
        }
      }])
      .then(function(answer) {
        var userChoice = result[parseInt(answer.productChoice) - 1];
        var userQty = parseInt(answer.quantity);
        var newQty = userChoice.stock_quantity - userQty;
        console.log("You chose " + userQty + " of the " + userChoice.product_name + "s.");

        if (userQty > userChoice.stock_quantity) {
          console.log("Sorry! Insufficient quantity. Your order connot be processed.");
          start();
        } else {

          // update database with new quantity & let user know order confirmed & total price
          // con.query("UPDATE products SET ? WHERE ?", [
          //   {
          //     stock_quantity: newQty
          //   },
          //   {
          //     item_id: userChoice
          //   }
          // ], function(err) {
          //   if (err) throw err;
          //   console.log("Order confirmed. Your total is $" + (userChoice.retail_price * userQty) + ".")
          // });
          console.log("Order confirmed. Your total is $" + (userChoice.retail_price * userQty) + ".");
          start();

        }
      });
  });
} 

