const mysql = require("mysql");
const util = require("util");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs_mysql",
});

db.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connect Database !!!");
  }
});

db.query = util.promisify(db.query);

module.exports = db;
