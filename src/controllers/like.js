const { Like, Time } = require('../models');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/index');

const getLike = async(req, res) => {
    const { timeId } = req.params;
    const user = req.decoded.id;
    try{
        const like = await Like.findAll({
            where:{
                time_id: timeId,
            }
        });
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

const createLike = async(req, res) => {
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
        if(having) return res.status(409).json({
            "message" : "이미 좋아요를 생성했습니다.",
        })
        const like = await Like.create({
            time_id : timeId,
            user_id : user,
        });
        return res.status(200).json({
            "message" : "좋아요가 생성되었습니다.",
        })
    }catch(err){
        console.error(err);
        return res.status(400).json({
            "message" : "잘못된 요청입니다.",
        });
    }
}

const deleteLike = async(req, res) =>{
    try{
        const { timeId } = req.params;
        const user = req.decoded.id;
        if(!timeId) return res.status(404).json({
            "message" : "존재하지 않는 타임테이블입니다.",
        })
        const like = await Like.findOne({
            where : {
                time_id: timeId,
                user_id: user,
            }
        })
        if(!like) return res.status(404).json({
            "message" : "좋아요를 찾을 수 없습니다.",
        })
        else{
            await like.destroy();
            return res.status(204).json();
        }
    }catch(error){
        console.error(err);
        return res.status(400).json({
            "message" : "잘못된 요청입니다.",
        })
    }
}

module.exports = {
    getLike,
    createLike,
    deleteLike,
};