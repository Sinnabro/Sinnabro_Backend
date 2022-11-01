const { Todo } = require('../models');
const { User } = require('../models');

const createTodo = async(req, res) => {
    const { sub, content, check } = req.body;
    const user = req.decoded;

    try{
        await Todo.create({
            writer : user.id,
            sub,
            content,
            check
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

const updateTodo = async(req, res) => {
    const todoId = req.params.todo_id;
    const UserId = req.decoded.id;
    const { sub, content, check } = req.body;

    try{
        const todo = await Todo.findOne({
            where : { id : todoId },
        })
        if(!todoId){
            res.status(404).json({
                "message" : "존재하지 않는 투두입니다."
            });
            console.error(err);
        }else if(todo.writer !== UserId){
            res.status(403).json({
                "message" : "투두는 해당 투두의 작성자만 수정할 수 있습니다."
            })
        }else{
            await todo.update({
                sub,
                content,
                check,
            });
            res.status(200).json({
                "message" : "투두가 수정되었습니다."
            });
        }
    }catch(err){
        res.status(400).json({
            "message" : "잘못된 요청입니다."
        });
        console.error(err);
    };
}

module.exports = {
    createTodo,
    updateTodo,
};