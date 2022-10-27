const { Todo } = require('../models');

const createTodo = async(req, res) => {
    const { sub, content, check } = req.body;
    const user = req.decoded;

    try{
        await Todo.create({
            sub,
            content,
            check,
            writer : user.id
        });

        return res.status(201).json({
            "message": "투두가 생성되었습니다.",
        });
    }catch(err){
        console.error(err);
        return res.status(400).json({
            "message" : "잘못된 요청입니다.",
        });
    }
};

module.exports = {
    createTodo
};