const express = require('express');
const mybatisMapper = require('mybatis-mapper');
const router = express.Router();
const getConnection = require('../config/db');

mybatisMapper.createMapper(['./server/mapper/userMapper.xml']);

router.get('/', (req, res) => {
    res.send('안녕하세요');
});

router.get('/select', (req, res) => {
    /*getConnection((conn) => {
        conn.query('SELECT * FROM user_info', (error, result) => {
            res.send(result);
        });
        conn.release();  // 사용 후 꼭 conn.release()를 통해 Pool에 Connection을 반환해야 함
    });*/

    const param = {
        col : 'name'
    };
    const format = { language : 'sql', indent : '    ' };
    const query = mybatisMapper.getStatement('userMapper', 'getUserInfo', param, format);

    getConnection(conn => {
        conn.query(query, (error, result) => {
            if (!error) res.send(result);
            else res.send(error);
        });
        conn.release();
    });
});

module.exports = router;