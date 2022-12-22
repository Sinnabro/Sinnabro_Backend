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

const getTime = async(req, res) => {
    const date = req.body.date;
    const user = req.decoded.id;
    const user_id = req.body.user_Id;
    
    try{
        const times = await Time.findOne({
            where: {
                user_id,
                date,
            }
        })
        if(!times){
            return res.status(404).json({
                "message" : "타임테이블이 존재하지 않습니다."
            })
        }
        res.status(200).json({
            "message" : "공부 시간을 조회합니다.",
            times,
        })
    }catch(err){
        console.error(err)
        res.status(400).json({
            "message" : "잘못된 요청입니다.",
        });
    }
};

const updateTime = async(req, res) => {
    const user = req.decoded.id;
    const { date, hour, time } = req.body;

    try {
        if (date !== moment().format('YYYY-MM-DD')) {
            return res.status(403).json({
                "message" : "오늘의 타임테이블만 수정 가능합니다.",
            })
        }

        const times = await Time.findOne({
            where: {
                user_id: user,
                date,
            }
        });

        if(!times){
            return res.status(404).json({
                "message" : "존재하지 않는 타임테이블입니다.",
            })
        };
        
        await times.update({
            [hour] : time,
        });
        return res.status(200).json({
            "message" :"공부 시간이 수정되었습니다.",
            times,
        });
    } catch(err) {
        console.error(err);
        res.status(400).json({
            "message" : "잘못된 요청입니다.",
        });
    }
}

module.exports = {
    createTime,
    getTime,
    updateTime,
};