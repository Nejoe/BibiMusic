// 引入mysql模块
const mysql = require('mysql');
// 创建连接
function query(sql, values, callback) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'hx5224865',
        database: 'bibi_music'
    });
    connection.connect();
    connection.query(sql, values, callback);
    connection.end();
};
module.exports = query;