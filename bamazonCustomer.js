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
          if (Number.isInteger(value) && value > 0) {
            return true;
          }
          return false;
        }
      }])
      .then(function(answer) {
        var userChoice = result[parseInt(answer.productChoice) - 1];
        var userQty = parseInt(answer.quantity);

        console.log("You chose " + userQty + " of the " + userChoice.product_name);

        if (userQty > userChoice.stock_quantity) {
          console.log("Insufficient quantity available. Your order cannot be processed.");
          start();
        } else {
          // update database with new quantity, confirm order & give user total price
            con.query("UPDATE products SET ? WHERE ?", [
              {
                stock_quantity: (userChoice.stock_quantity - userQty)
              },
              {
                item_id: userChoice.item_id
              }
            ], function(err) {
              if (err) throw err;
              console.log("Order confirmed. Your total is $" + (userChoice.retail_price * userQty) + ".");
              console.log("New quantity available of " + userChoice.product_name + ": " + userChoice.stock_quantity);
            });
          start();
        }
      })
      .catch(err);
  });
} 

