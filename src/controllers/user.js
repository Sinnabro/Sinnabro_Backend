const { User } = require("../models");

const signup = async(req, res) => {
    const { email, name, password } =req.body;

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

module.exports = {
    signup
};