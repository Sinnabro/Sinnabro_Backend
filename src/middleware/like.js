const { Like, Time } = require('../models');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/index');

const createLike = async(req, res) => {
    const { timeId } = req.params;
    const user = req.decoded.id;
    try{
        const like = await Like.create({
            time_id : timeId,
            user_id : user,
        });
        const stat = 200;
        return stat;
    }catch(err){
        console.error(err);
        return err;
    }
}

const deleteLike = async(req, res) =>{
    const { timeId } = req.params;
    const user = req.decoded.id;
    try{        
        const like = await Like.findOne({
            where : {
                time_id: timeId,
                user_id: user,
            }
        })
        await like.destroy();
        const stat = 204;
        return stat;
    }catch(err){
        console.error(err);
        return err;
    }
}

module.exports = {
    createLike,
    deleteLike,
}