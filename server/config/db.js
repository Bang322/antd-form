/**
 * Connection Pool 모듈화
 * 필요한 곳에서 require 을 통해 불러오고 getConnection을 통해 Connection을 얻을 수 있음
 */
const mysql = require('mysql');

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'bang',
    database : 'reactstudy'
});

const getConnection = (callback) => {
    pool.getConnection((err, conn) => {
        // error가 발생하지 않았을 때, 파라미터로 받은 callback 함수에 Connection(conn)을 전달
        if (!err) callback(conn);
    });
};

module.exports = getConnection;
