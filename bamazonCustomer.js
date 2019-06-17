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
        console.log(result);
    });
});


