const jwt = require("jsonwebtoken");

const tokenMiddleware = async(req, res, next) => {
    const token = await req.headers["access-token"];

    if (!token ) {
        res.status(401).json({
            message: "로그인이 필요합니다."
        });
    }

    try {
        jwt.verify(token, req.app.get("jwt-secret"), (err, decoded) => {
            if(err) throw new Error(err.message);
            req.decoded = decoded;
            next();
        });
    } catch(err) {
        res.status(401).json({
            message: "로그인이 필요합니다."
        });
        console.error(err);
    }
};

module.exports = tokenMiddleware;