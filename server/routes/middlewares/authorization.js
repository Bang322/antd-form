/* accessToken 과 refreshToken 의 유효성을 검증하는 미들웨어
 * accessToken 은 요청 헤더에서 Authorization 값을 가져온다
 * refreshToken 은 요청의 쿠키에서 refreshToken 값을 가져온다
 * 토큰 인증이 실패하거나 해당 토큰이 만료됐다면, 응답 코드를 401로 설정(Unauthorized)
 */
const jwt = require('jsonwebtoken');

exports.verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, 'bangRefreshTokenKey');

            if (decoded) {
                req.userId = decoded.userId;
                next();
            } else {
                res.status(401).json({
                    success : false,
                    message : '토큰 인증 실패'
                });
            }
        } catch (error) {
            res.status(401).json({
                success : false,
                message : '토큰 만료됨'
            });
        }
    } else {
        res.json({success : false});
    }
};

exports.verifyAccessToken = (req, res, next) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decoded = jwt.verify(accessToken, 'bangAccessTokenKey');

        if (decoded) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(401).json({
                success : false,
                error : '토큰 인증 실패'
            });
        }
    } catch(error) {
        res.status(401).json({
            success : false,
            error : '토큰 만료됨'
        });
    }
};