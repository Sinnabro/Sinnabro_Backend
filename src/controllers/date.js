const { Date, User } = require("../models");
const moment = require("moment");

const createDate = async (req, res) => {
  const { dayname, date } = req.body;
  const UserId = req.decoded.id;

  try {
    const user = await Date.findOne({
      where: {
        user_id: UserId,
      },
    });

    const NameUser = await User.findOne({
      where: { id: UserId },
    });

    if (user) {
      return res.status(409).json({
        message: "디데이가 이미 존재합니다.",
      });
    }

    const aFewDate = moment(date);
    const today = moment().format("YYYY-MM-DD");

    const sub = aFewDate.diff(today, "days") + 1;

    await Date.create({
      user_id: UserId,
      username: NameUser.name,
      dayname,
      date,
      Dday: sub,
    });

    return res.status(201).json({
      message: "디데이가 설정되었습니다.",
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }
};

const readDate = async (req, res) => {
  const Id = req.params.user_id;

  try {
    const date = await Date.findOne({
      where: {
        user_id: Id,
      },
    });

    if (!date) {
      return res.status(404).json({
        message: "해당 유저는 디데이가 존재하지 않습니다.",
      });
    }

    return res.status(200).json(date);
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }
};

const updateDate = async (req, res) => {
  const { dayname, date } = req.body;
  const Id = req.params.user_id;
  const UserId = req.decoded.id;

  try {
    const findDate = await Date.findOne({
      where: {
        user_id: Id,
      },
    });

    if (!findDate) {
      return res.status(404).json({
        message: "존재하지 않는 디데이입니다.",
      });
    } else if (findDate.user_id !== UserId) {
      return res.status(403).json({
        message: "디데이는 본인만 수정할 수 있습니다.",
      });
    } else {
      const aFewDate = moment(date);
      const today = moment().format("YYYY-MM-DD");

      const sub = aFewDate.diff(today, "days") + 1;

      await findDate.update({
        dayname,
        date,
        Dday: sub,
      });

      return res.status(200).json({
        message: "디데이가 수정되었습니다.",
      });
    }
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }
};

module.exports = {
  createDate,
  readDate,
  updateDate,
};
