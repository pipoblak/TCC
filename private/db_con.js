var mysql=require('mysql');
var connection=mysql.createConnection({
  host:'localhost',
   user:'root',
   password:'',
   multipleStatements: true
});
module.exports=connection;
