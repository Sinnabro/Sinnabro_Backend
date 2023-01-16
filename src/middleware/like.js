const { Like, Time } = require("../models");

const createLike = async (req, res) => {
  const { timeId } = req.params;
  const user = req.decoded.id;
  try {
    const time = await Time.findOne({
      where: {
        id: timeId,
      },
    });

    await Like.create({
      time_id: timeId,
      user_id: user,
    });

    const CountLike = await Like.count({
      where: { time_id: timeId },
    });

    await time.update({
      like: CountLike,
    });

    const stat = 200;
    return stat;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const deleteLike = async (req, res) => {
  const { timeId } = req.params;
  const user = req.decoded.id;
  try {
    const like = await Like.findOne({
      where: {
        time_id: timeId,
        user_id: user,
      },
    });

    const time = await Time.findOne({
      where: {
        id: timeId,
      },
    });

    await like.destroy();

    const CountLike = await Like.count({
      where: { time_id: timeId },
    });

    await time.update({
      like: CountLike,
    });

    const stat = 204;
    return stat;
  } catch (err) {
    console.error(err);
    return err;
  }
};

module.exports = {
  createLike,
  deleteLike,
};
