const { User } = require("../models");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

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

            await user.update({
                token: accessToken
            });
            
            return res.status(200).json({
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

const deleteUser = async(req, res) => {
    const { email, password } = req.body;
    const token = await req.headers["access-token"];
    const decodedEmail = req.decoded.email;

    const user = await User.findOne({
        where: { email: decodedEmail }
    });

    const emailUser = await User.findOne({
        where: { email }
    });
    console.log(user);

    try {
        if (user.email !== email) {
            if(!emailUser) {
                return res.status(404).json({
                    message: "존재하지 않는 회원입니다."
                });
            }
            throw Error;
    
        } else if (user.password !== password) {
            return res.status(400).json({
                message: "올바르지 않은 비밀번호입니다."
            });
        } else if (token !== user.token) {
            return res.status(403).json({
                message: "권한이 없습니다."
            });
        } else {
            await user.destroy();

            return res.status(200).json({
                message: "회원 탈퇴가 완료되었습니다."
            });
        }
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: "잘못된 요청입니다."
        });
    }
};

const updatePassword = async(req, res) => {
    const { password, new_password } = req.body;
    const decoded = req.decoded.id;

    try {
        const user = await User.findOne({
            where: {
                id: decoded
            }
        });

        if (user.password !== password) {
            res.status(400).json({
                message: "현재 비밀번호가 올바르지 않습니다."
            });
        } else if (password === new_password) {
            res.status(400).json({
                message: "현재 비밀번호와 같지 않도록 수정하세요."
            });
        } else {
            await user.update({
                password : new_password
            });

            res.status(200).json({
                message: "비밀번호가 수정되었습니다."
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
    login,
    deleteUser,
    updatePassword
};