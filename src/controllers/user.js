const { User } = require("../models");

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

module.exports = {
    signup,
    namecheck
};