var mysql=require('mysql2');
var connection= mysql.createConnection({
  host:'localhost',
   user:'root',
   password:'',
   multipleStatements: true
});
module.exports=connection;
