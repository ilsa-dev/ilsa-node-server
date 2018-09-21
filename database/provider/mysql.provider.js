var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'primefaces'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('mysql: connected as id ' + connection.threadId);
  });

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('Letting server do 1+1; The solution is: ', results[0].solution);
});

insertSimulatorEvent = (learnerId, questionCode, eventName, timeStamp) => {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO simulatorlog SET ?', { learnerId, questionCode, eventName, timeStamp }, function (error, results, fields) {
            if (error) reject(error);
            resolve('inserted!');
        });
    });
};

module.exports = {insertSimulatorEvent};