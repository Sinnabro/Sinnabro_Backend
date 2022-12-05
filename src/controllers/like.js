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
        const count = await sequelize.query(
            `SELECT COUNT(CASE WHEN time_id='${timeId}' THEN 1 END) AS COUNT_LIKE FROM likes;`,
            {type: QueryTypes.SELECT}
        )
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

module.exports = {
    getLike,
};