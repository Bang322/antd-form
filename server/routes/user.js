const express = require('express');
const router = express.Router();
const mybatisMapper = require('mybatis-mapper');
const getConnection = require('../config/db');

mybatisMapper.createMapper(['./server/mapper/userMapper.xml']);
router.use(express.json());

router.post('/checkUserId', (req, res) => {
    console.log('아이디 체크 서버 실행됨');
    const format = { language : 'sql', indent : '    ' };
    const query = mybatisMapper.getStatement('userMapper', 'getUserInfoById', req.body, format);

    getConnection(conn => {
        conn.query(query, (error, result) => {
            if (!error) {
                if (!result.length) {
                    res.json({ success : true });
                } else {
                    res.json({ success : false });
                }
            } else {
                res.json({ success : false });
            }
        });
        conn.release();
    });
});

module.exports = router;