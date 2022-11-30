const { Comment, Time } = require("../models");

const createComment = async(req, res) => {
    const { content } = req.body;
    const TimeId = req.params.time_id;
    const user = req.decoded;

    try {
        await Comment.create({
            user_id: user.id,
            time_id: TimeId,
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

const readAllComment = async(req, res) => {
    const TimeId = req.params.time_id;

    try {
        const time = await Time.findOne({
            where: { id: TimeId }
        });

        const comments = await Comment.findAll({
            where: { time_id: TimeId}
        });

        if (!time) {
            return res.status(404).json({
                message: "존재하지 않는 타임테이블입니다."
            });
        } else {
            return res.status(200).json(comments);
        }
    } catch(err) {
        console.error(err);

        return res.status(400).json({
            message: "잘못된 요청입니다."
        });
    }
};

const updatecomment = async(req, res) => {
    const { content } = req.body;
    const TimeId = req.params.time_id;
    const CommentId = req.params.id;
    const UserId = req.decoded.id;

    try {
        const time = await Time.findOne({
            where: { id: TimeId }
        });
        const comment = await Comment.findOne({
            where: { id: CommentId }
        });

        if (!time) {
            return res.status(404).json({
                message: "존재하지 않는 타임테이블입니다."
            });
        } else if (!comment) {
            return res.status(404).json({
                message: "존재하지 않는 댓글입니다."
            });
        } else if (comment.user_id !== UserId) {
            return res.status(403).json({
                message: "댓글은 해당 댓글의 작성자만 수정할 수 있습니다."
            });
        } else {
            await comment.update({ content });

            return res.status(200).json({
                message: "댓글이 수정되었습니다."
            });
        }
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: "잘못된 요청입니다."
        });
    }
};

const deleteOneComment = async(req, res) => {
    const TimeId = req.params.time_id;
    const CommentId = req.params.id;
    const UserId = req.decoded.id;

    try {
        const time = await Time.findOne({
            where: {
                id: TimeId
            }
        });
        const comment = await Comment.findOne({
            where: {
                id: CommentId
            }
        });

        if (!time) {
            return res.status(404).json({
                message: "존재하지 않는 타임테이블입니다."
            });
        } else if (!comment) {
            return res.status(404).json({
                message: "존재하지 않는 댓글입니다."
            });
        }

        if (comment.user_id !== UserId && time.user_id !== UserId) {

            return res.status(403).json({
                message: "댓글은 해당 댓글의 작성자 또는 해당 플래너 작성자만 삭제할 수 있습니다."
            });
        } else {
            await comment.destroy();

            return res.status(200).json({
                message: "댓글이 삭제되었습니다."
            });
        }
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: "잘못된 요청입니다."
        });
    }
};

module.exports = {
    createComment,
    readAllComment,
    updatecomment,
    deleteOneComment
};