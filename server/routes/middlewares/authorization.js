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