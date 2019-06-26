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
    var productChoiceList = [];
    for (i = 0; i < result.length; i++) {
      var itemNums = result[i].item_id;
      productChoiceList.push(itemNums);

    }
    if (err) throw err;
    inquirer
      .prompt([
        {
        name: "productChoice",
        type: "list",
        message: "Which Item ID would you like to buy?",
        choices: productChoiceList
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
        // var userChoice = result[parseInt(answer.productChoice) - 1];
        var userChoice = parseInt(answer.productChoice);
        var userQty = parseInt(answer.quantity);

        // loop through results to get item ids in case numbers are not sequential (i.e. item deleted from database)
        for (i = 0; i < result.length; i++) {
          if (result[i].item_id === userChoice) {
            var userIndex = result[i];

            console.log("You chose " + userQty + " of the " + userIndex.product_name);

            if (userQty > userIndex.stock_quantity) {
              console.log("Insufficient quantity available. Your order cannot be processed.");
              start();
            } else {
              // update database with new quantity, confirm order & give user total price
                con.query("UPDATE products SET ? WHERE ?", [
                  {
                    stock_quantity: (userIndex.stock_quantity - userQty)
                  },
                  {
                    item_id: userIndex.item_id
                  }
                ], function(err) {
                  if (err) throw err;
                  console.log("Order confirmed. Your total is $" + (userIndex.retail_price * userQty).toFixed(2) + ".");
                  quit();

                });
            }
          }
        }
      })
      .catch(err);
  });
} 
// option to continue shopping or quit
function quit() {
  inquirer
    .prompt([
      {
      name: "continue",
      type: "list",
      message: "Continue shopping?",
      choices: ["Yes", "No"]
    }])
    .then(function(answer) {
      if (answer.continue === "Yes") {
        start();
      } else {
        console.log("Thank you for shopping at Bamazon.")
        con.end();
      }
    })
}