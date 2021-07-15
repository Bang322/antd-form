const express = require('express');
const router = express.Router();
const mybatisMapper = require('mybatis-mapper');
const getConnection = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

mybatisMapper.createMapper(['./server/mapper/userMapper.xml']);
router.use(express.json());

// 클라이언트로부터 userId 값을 받아 DB 조회
router.post('/checkUserId', (req, res) => {
    const format = { language : 'sql', indent : '    ' };
    const query = mybatisMapper.getStatement('userMapper', 'getUserInfoById', req.body, format);

    getConnection(conn => {
        conn.query(query, (error, result) => {
            if (!error) {
                if (!result.length) {  // DB에 userId 값과 같은 id 값을 가진 레코드가 없다면 -> 사용가능한 아이디
                    res.json({ success : true });
                } else {  // DB에 userId 값과 같은 id 값을 가진 레코드가 있으면 -> 이미 사용중인 아이디
                    res.json({ success : false });
                }
            } else {  // query 자체가 실패했을 경우
                res.json({ success : false });
            }
        });
        conn.release();
    });
});

// 클라이언트로부터 받은 회원가입 정보들을 DB 에 저장
router.post('/signUp', async (req, res) => {
    // 비밀번호 암호화 (bcrypt)
    const { password } = req.body;
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        req.body.password = hash;
        console.log(req.body);

        const format = { language : 'sql', indent : '    ' };
        const query = mybatisMapper.getStatement('userMapper', 'insertUserInfo', req.body, format);

        getConnection(conn => {
            conn.query(query, (error, result) => {
                if (!error) res.json({ success : true });
                else res.json({ success : false });
            });
            conn.release();
        });
    } catch (error) {
        res.json({ success : false });
    }
});

// 로그인 api
router.post('/signIn', (req, res) => {
    const format = { language : 'sql', indent : '    ' };
    const query = mybatisMapper.getStatement('userMapper', 'getUserInfoById', req.body, format);

    getConnection(conn => {
        conn.query(query, async (error, result) => {
            if (!error) {
                if (result.length) {  // 에러가 발생하지 않았고, 결과값이 있을 때
                    const { user_id, password } = result[0];
                    // userId 를 통해 가져온 레코드에 있는 암호화된 비밀번호와 사용자가 입력한 비밀번호를 비교
                    const match = await bcrypt.compare(req.body.password, password);

                    // match 값은 일치하면 true, 일치하지 않으면 false
                    if (match) {
                        // 유저 아이디를 통해 accessToken 생성
                        const accessToken = jwt.sign({
                            userId : user_id
                        }, 'bangAccessTokenKey', {
                            expiresIn : '1h'
                        });

                        // 유저 아이디를 통해 refreshToken 생성
                        const refreshToken = jwt.sign({
                            userId : user_id
                        }, 'bangRefreshTokenKey', {
                            expiresIn : '24h'
                        });

                        // refreshToken 은 서버에서 httpOnly 옵션을 설정하여 쿠키에 저장
                        // accessToken 은 저장하지 않는다!
                        res.cookie('refreshToken', refreshToken, { httpOnly : true });

                        res.json({
                            success : true,
                            userId : user_id,
                            accessToken
                        });
                    } else {
                        res.json({ success : false });
                    }
                }
            }
            else res.json({ success : false });
        });
        conn.release();
    });
})

module.exports = router;