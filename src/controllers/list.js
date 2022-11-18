const { Todo, User } = require('../models');
const moment = require('moment');

const getlist = async(req, res) => {
    const date = moment(new Date(req.body.date)).format('YYYY-MM-DD');
    try{
        const today = moment().format('YYYY-MM-DD');
        
        const dateUser = await Todo.findAll({
            where: { date },
            raw: true,
            attributes : ["writer"],
            include: [
                { model: User, attributes: ['id', 'name', 'email'], required: false }
              ]
        });
        const date1 = new Date(today);
        const date2 = new Date(date);
        if(!dateUser){
            res.status(404).json({
                "message" : "작성자를 찾을 수 없습니다."
            })
        }else if(date1 < date2){
            res.status(400).json({
                "message" : "미래의 작성자는 조회할 수 없습니다.",
            })
        }else{
            res.status(200).json({
                "message" : `${moment(date).format('YYYY-MM-DD')}의 작성자를 조회합니다.`,
                dateUser,
            })
        }
    }catch(err){
        res.status(400).json({
            "message" : "잘못된 요청입니다.",
        })
    }
}

module.exports = {
    getlist,
}