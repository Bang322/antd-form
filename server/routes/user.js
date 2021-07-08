const express = require('express');
const router = express.Router();
const mybatisMapper = require('mybatis-mapper');
const getConnection = require('../config/db');

mybatisMapper.createMapper(['./server/mapper/userMapper.xml']);
router.use(express.json());

router.post('/checkUserId', (req, res) => {
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

router.post('/signUp', (req, res) => {
    const format = { language : 'sql', indent : '    ' };
    const query = mybatisMapper.getStatement('userMapper', 'insertUserInfo', req.body, format);

    getConnection(conn => {
        conn.query(query, (error, result) => {
            console.log(result);
            if (!error) res.json({ success : true });
            else res.json({ success : false });
        });
        conn.release();
    });
});

module.exports = router;