const { Comment } = require("../models");

const createComment = async(req, res) => {
    const { content } = req.body;
    const TodoId = req.params.todo_id;
    const user = req.decoded;

    try {
        await Comment.create({
            user_id: user.id,
            todo_id: TodoId,
            name: user.name,
            content
        });

        return res.status(201).json({
            message: "댓글이 생성되었습니다."
        });
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: "잘못된 요청입니다."
        });
    }
};

module.exports = {
    createComment
};