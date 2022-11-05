const { Date } = require("../models");
const moment = require("moment");

const createDate = async(req, res) => {
    const { dayname, date } = req.body;
    const UserId = req.decoded.id;

    try {
        const user = await Date.findOne({
            where: {
                user_id: UserId
            }
        });

        if (user) {
            return res.status(409).json({
                message: "디데이가 이미 존재합니다."
            });
        }

        const aFewDate = moment(date);
        const today = moment().format("YYYY-MM-DD");
        
        const sub = aFewDate.diff(today, 'days') + 1;

        await Date.create({
            user_id: UserId,
            dayname,
            date,
            Dday: sub
        });

        return res.status(201).json({
            message: "디데이가 설정되었습니다."
        });
    } catch(err) {
        console.error(err);

        return res.status(400).json({
            message: "잘못된 요청입니다."
        });
    }
};

const deleteDate = async(req, res) => {
    const DateId = req.params.id;
    const UserId = req.decoded.id;

    try {
        const date = await Date.findOne({
            where: {
                id: DateId
            }
        });

        
        if (!date) {
            return res.status(404).json({
                message: "존재하지 않는 디데이입니다."
            });
        } else if ( date.user_id !== UserId) {
            return res.status(403).json({
                message: "디데이는 본인만 삭제할 수 있습니다."
            });
        } else {
            await date.destroy();

            return res.status(200).json({
                message: "디데이가 삭제되었습니다."
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
    createDate,
    deleteDate
};