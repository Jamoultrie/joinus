var express = require('express');
var mysql = require('mysql');
var bodyParser  = require("body-parser");
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

var connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

connection.query("CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(100))", function(err){
  if(err) throw err;
});

app.get("/", function(req, res) {
    // Find count of users in DB
    var q = "SELECT * FROM users";
    connection.query(q, function(err, results){
        if(err) throw err;

        var count = results.length
        var emails = results

        res.render("home", {
          count: count,
          emails: emails
        });
    });
});

app.post("/register", function(req, res){
    var person = {
        email: req.body.email
    };
    connection.query('INSERT INTO users SET ?', person, function(err, result) {
        if (err) throw err;
        res.redirect("/");
    });
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Server running!");
});
