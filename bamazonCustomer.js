var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
    user: 'root',
    password: 'password',
    database: 'bamazon_db',
    host: 3306
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
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
        message: "How many would you like?"
      }])
      .then(function(answer) {
          if (parseInt(answer.quantity) > result[parseInt(answer.productChoice) - 1].stock_quantity) {
            console.log("Sorry! Insufficient quantity. Your order connot be processed.")
          } else {
            console.log("Order confirmed.")
          }
      })
  })
} 

