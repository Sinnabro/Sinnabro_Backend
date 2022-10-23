const { User } = require("../models");
const jwt = require("jsonwebtoken");

const signup = async(req, res) => {
    const { email, name, password } = req.body;

    try {
        await User.create({
            email,
            name,
            password
        });

        res.status(201).json({
            message: "회원가입이 완료되었습니다."
        });
    } catch(err) {
        res.status(400).json({
            message: "잘못된 요청입니다."
        });
        console.error(err);
    }
};

const namecheck = async(req, res) => {
    const { name } = req.body;

    try {
        const nameuser = await User.findOne({
            where: {
                name: name
            }
        });

        if(!nameuser) {
            res.status(200).json({
                message: "사용가능한 닉네임입니다."
            });
        } else if(nameuser) {
            res.status(409).json({
                message: "중복된 닉네임입니다."
            });
        }
    } catch(err) {
        res.status(400).json({
            message: "잘못된 요청입니다."
        });
        console.error(err);
    }
};

const login = async(req, res) => {
    const { email, password } = req.body;
    const secretKey = req.app.get("jwt-secret");

    try {
        const user = await User.findOne({
            where: { email }
        });

        if (user.password === password) {
            const accessToken = jwt.sign({
                id: user.id,
                email: user.email,
                name: user.name
            },
            secretKey,
            {
                expiresIn: "1h"
            });
            res.status(200).json({
                message: "로그인이 완료되었습니다.",
                accessToken
            });
        } else {
            res.status(400).json({
                message: "올바르지 않은 비밀번호입니다."
            });
        }
    } catch(err) {
        res.status(400).json({
            message: "잘못된 요청입니다."
        });
        console.error(err);
    }
};

module.exports = {
    signup,
    namecheck,
    login
};