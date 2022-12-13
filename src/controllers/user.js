const { User, Verify } = require("../models");
const jwt = require("jsonwebtoken");
const { Transport } = require("../config/email");

const signup = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const useremail = await User.findOne({
      where: { email },
    });

    if (useremail) {
      return res.status(409).json({
        message: "이미 존재하는 회원입니다.",
      });
    }

    await User.create({
      email,
      name,
      password,
    });

    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
    });
  } catch (err) {
    res.status(400).json({
      message: "잘못된 요청입니다.",
    });
    console.error(err);
  }
};

const namecheck = async (req, res) => {
  const { name } = req.body;

  try {
    const nameuser = await User.findOne({
      where: {
        name: name,
      },
    });

    if (!nameuser) {
      res.status(200).json({
        message: "사용가능한 닉네임입니다.",
      });
    } else if (nameuser) {
      res.status(409).json({
        message: "중복된 닉네임입니다.",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "잘못된 요청입니다.",
    });
    console.error(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const secretKey = req.app.get("jwt-secret");

  try {
    const user = await User.findOne({
      where: { email },
    });

    if (user.password === password) {
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        secretKey,
        {
          expiresIn: "1h",
        }
      );

      await user.update({
        token: accessToken,
      });

      return res.status(200).json({
        message: "로그인이 완료되었습니다.",
        accessToken,
      });
    } else {
      return res.status(400).json({
        message: "올바르지 않은 비밀번호입니다.",
      });
    }
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }
};

const deleteUser = async (req, res) => {
  const { email, password } = req.body;
  const token = await req.headers["access-token"];
  const decodedEmail = req.decoded.email;

  const user = await User.findOne({
    where: { email: decodedEmail },
  });

  const emailUser = await User.findOne({
    where: { email },
  });
  console.log(user);

  try {
    if (user.email !== email) {
      if (!emailUser) {
        return res.status(404).json({
          message: "존재하지 않는 회원입니다.",
        });
      }
      throw Error;
    } else if (user.password !== password) {
      return res.status(400).json({
        message: "올바르지 않은 비밀번호입니다.",
      });
    } else if (token !== user.token) {
      return res.status(403).json({
        message: "권한이 없습니다.",
      });
    } else {
      await user.destroy();

      return res.status(200).json({
        message: "회원 탈퇴가 완료되었습니다.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }
};

const updatePassword = async (req, res) => {
  const { password, new_password } = req.body;
  const decoded = req.decoded.id;

  try {
    const user = await User.findOne({
      where: {
        id: decoded,
      },
    });

    if (user.password !== password) {
      res.status(400).json({
        message: "현재 비밀번호가 올바르지 않습니다.",
      });
    } else if (password === new_password) {
      res.status(400).json({
        message: "현재 비밀번호와 같지 않도록 수정하세요.",
      });
    } else {
      await user.update({
        password: new_password,
      });

      res.status(200).json({
        message: "비밀번호가 수정되었습니다.",
      });
    }
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }
};

const findPassword = async (req, res) => {
  const UserEmail = req.params.email;
  const { new_password } = req.body;

  try {
    const user = await User.findOne({
      where: { email: UserEmail },
    });

    if (!user) {
      return res.status(404).json({
        message: "존재하지 않은 회원입니다.",
      });
    }

    await user.update({
      password: new_password,
    });

    return res.status(200).json({
      message: "비밀번호가 수정되었습니다.",
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }
};

const sendEmail = async (req, res) => {
  const generateRandom = function (min, max) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  };

  const number = generateRandom(111111, 999999);

  const { email } = req.body;

  const emailcode = await Verify.findOne({
    where: { email },
  });

  if (emailcode) {
    await emailcode.update({
      code: number,
    });
  } else {
    await Verify.create({
      email,
      code: number,
    });
  }

  const mailOptions = {
    from: process.env.USEREMAIL,
    to: email,
    subject: "[SINNABRO] 인증 관련 이메일입니다.",
    text: "오른쪽 숫자 여섯 자리를 입력해주세요 : " + number,
  };

  await Transport.sendMail(mailOptions, (error) => {
    if (error) {
      res.status(400).json({
        message: "error",
      });
    } else {
      res.status(200).json({
        message: number,
      });
    }
    Transport.close();
  });
};

const verifyEmail = async (req, res) => {
  const useremail = req.params.email;
  const { code } = req.body;

  try {
    const user = await Verify.findOne({
      where: { email: useremail },
    });

    if (!user) {
      return res.status(404).json({
        message: "해당 이메일이 존재하지 않습니다.",
      });
    }

    if (user.code !== code) {
      return res.status(400).json({
        message: "인증번호가 알맞지 않습니다.",
      });
    }

    return res.status(200).json({
      message: "올바른 인증번호입니다.",
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }
};

const mypage = async (req, res) => {
  const UserId = req.decoded.id;

  try {
    const user = await User.findAll({
      attributes: ["name", "email"],
      where: { id: UserId },
    });

    return res.status(200).json({
      message: "마이페이지를 조회합니다.",
      user,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "잘못된 요청입니다.",
    });
  }
};

module.exports = {
  signup,
  namecheck,
  login,
  deleteUser,
  updatePassword,
  findPassword,
  sendEmail,
  verifyEmail,
  mypage,
};
