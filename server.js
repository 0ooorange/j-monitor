var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  port: "3306",
  database: "monitior-system"
});

connection.connect();
connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});

let sql = "insert into test(UID, FP) VALUES (9, 55);";
connection.query(sql, (err, result) => {
  if (err) {
    console.log("插入数据失败：", err);
    return;
  }
  console.log("--------------------------INSERT----------------------------");
  //console.log('INSERT ID:',result.insertId);
  console.log("INSERT ID:", result);
  console.log("-----------------------------------------------------------------\n\n");
});
