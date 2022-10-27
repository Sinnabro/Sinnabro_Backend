const { Todo } = require('../models');

const writeTodo = async(req, res) => {
    const { sub, content, check } = req.body;
    const { accessToken } = req.headers;
    const userId = req.decoded.user_id;

    try{
        if(!accessToken){
            res.status(401).json({
                "message" : "로그인이 필요합니다.",
            });
            console.error(err);
        }else {
            await Todo.create({
                id,
                user_id : userId,
                sub,
                content,
                check,
            });
            res.status(201).json({
                "message": "투두가 생성되었습니다.",
            });
        }
    }catch(err){
        res.status(400).json({
            "message" : "잘못된 요청입니다.",
        });
        console.error(err);
    };
}

module.exports = {
    writeTodo,
};