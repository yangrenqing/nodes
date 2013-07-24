var db_options = {  
    host: 'localhost',  
    port: 3306,  
    user: 'root',  
    password: 'yrq616620',  
    database: 'somesayss'  
};  
//加载mysql Module    
var mysql = require('mysql'),client = null;  

if(mysql.createConnection) {  
    client = mysql.createConnection(db_options);  
} else {  
    client = new mysql.Client(db_options);  
    client.connect(function(err) {  
        if(err) {  
            console.error('connect db ' + client.host + ' error: ' + err);  
            process.exit();  
        }  
    });  
}  
  
client.query(  
      'INSERT INTO users '+  
      'SET user = ?, password = ?',  
      ['ceshi', '11234']  
    );    
  
client.query(  
  'SELECT * FROM users',  
  function selectCb(err, results, fields) {  
    if (err) {  
      throw err;  
    }    
  
    console.log(results);  
   // console.log(fields);    
    client.end();  
  }  
); 