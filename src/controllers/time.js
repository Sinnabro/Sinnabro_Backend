const { Time } = require('../models');
const moment = require('moment');

const createTime = async(req, res) => {
    const { hour, times } = req.body;
    const user = req.decoded.id;

    try{ 
        const day = await Time.findOne({
            where: {
                user_id: user,
                date: moment().format('YYYY-MM-DD'),
            }
        })
        if(day){
            return res.status(409).json({
                "message" : "오늘의 타임 테이블이 이미 존재합니다."
            })
        }
        const today = await Time.create({
            user_id: user,
            date: moment().format('YYYY-MM-DD'),
            [hour]: times,
        });
        return res.status(201).json({
            "message": "공부 시간이 생성되었습니다.",
            today,
        });
    }catch(err){
        console.error(err)
        res.status(400).json({
            "message" : "잘못된 요청입니다.",
        });
    }
};

module.exports = {
    createTime,
};