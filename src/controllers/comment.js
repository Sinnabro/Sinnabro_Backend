const { Comment } = require("../models");
const { Todo } = require("../models");

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

const deleteOneComment = async(req, res) => {
    const TodoId = req.params.todo_id;
    const CommentId = req.params.id;
    const UserId = req.decoded.id;

    try {
        const todo = await Todo.findOne({
            where: {
                id: TodoId
            }
        });
        const comment = await Comment.findOne({
            where: {
                id: CommentId
            }
        });

        if (!todo) {
            return res.status(404).json({
                message: "존재하지 않는 투두입니다."
            });
        } else if (!comment) {
            return res.status(404).json({
                message: "존재하지 않는 댓글입니다."
            });
        }

        if (comment.user_id !== UserId) {

            return res.status(403).json({
                message: "댓글은 해당 댓글의 작성자만 삭제할 수 있습니다."
            });
        } else {
            await comment.destroy();

            return res.status(200).json({
                message: "댓글이 삭제되었습니다."
            });
        }
    } catch(err) {
        console.error(err);
        res.status(400).json({
            message: "잘못된 요청입니다."
        });
    }
};

module.exports = {
    createComment,
    deleteOneComment
};