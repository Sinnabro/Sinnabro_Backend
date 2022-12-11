const { Like, Time } = require('../models');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/index');
const { createLike, deleteLike } = require('../middleware/like');

const getLike = async(req, res) => {
    const { timeId } = req.params;
    const user = req.decoded.id;
    try{
        const like = await Like.findOne({
            where:{
                time_id: timeId,
            }
        });
        if(!like) return res.status(404).json({
            "message" : "좋아요가 존재하지 않습니다.",
        })
        const count = await Like.count({
            where : {
                time_id: timeId
            }
        })
        return res.status(200).json({
            "message" : "좋아요 수를 조회합니다.",
            count,
        })
    }catch(error){
        console.log(error);
        return res.status(400).json({
            "message" : "잘못된 요청입니다.",
        })
    }
}

const writeLike = async(req, res) => {
    const { timeId } = req.params;
    const user = req.decoded.id;
    try{        
        if(!timeId) return res.status(404).json({
            "message" : "존재하지 않는 타임테이블입니다.",
        })
        const having = await Like.findOne({
            where: {
                time_id : timeId,
                user_id : user,
            }
        })
        if(having){
            deleteLike(req, res);
            return res.status(204).json({
                "message" : "좋아요를 취소했습니다.",
            })
        }
        else createLike(req, res);
        return res.status(200).json({
            "message" : "좋아요를 생성했습니다."
        })
    }catch(err){
        console.error(err);
        return res.status(400).json({
            "message" : "잘못된 요청입니다.",
        })
    }
}

const cancelLike = async(req, res) => {
    const { timeId } = req.params;
    const user = req.decoded.id;
    try{
        if(!timeId) return res.status(404).json({
            "message" : "존재하지 않는 타임테이블입니다.",
        })
        const like = await Like.findOne({
            where: {
                time_id: timeId,
                user_id : user,
            }
        })
        if(!like) {
            console.log("There's no Like!");
            createLike(req, res);
            return res.status(200).json({
                "message" : "좋아요를 생성했습니다.",
            })
        }
        deleteLike(req, res)
        return res.status(204).json();
    }catch(err){
        console.error(err);
        return res.status(400).json({
            "message" : "잘못된 요청입니다.",
        })
    }
}

module.exports = {
    getLike,
    writeLike,
    cancelLike,
};