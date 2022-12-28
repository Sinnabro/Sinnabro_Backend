const { User, Verify, Time } = require("../models");
const jwt = require("jsonwebtoken");
const { Transport } = require("../config/email");
const crypto = require("crypto");
const { Op } = require("sequelize");

const signup = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const salt = crypto.randomBytes(32).toString("hex");
    const hashPassword = crypto
      .pbkdf2Sync(password, salt, 2, 32, "sha512")
      .toString("hex");

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
      password: hashPassword,
      salt,
    });

    return res.status(201).json({
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

    const hashPassword = crypto
      .pbkdf2Sync(password, user.salt, 2, 32, "sha512")
      .toString("hex");

    if (user.password === hashPassword) {
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
  const token =
    (await req.headers.authorization.split("Bearer ")[1]) || req.query.token;
  const decodedEmail = req.decoded.email;

  const user = await User.findOne({
    where: { email: decodedEmail },
  });

  const emailUser = await User.findOne({
    where: { email },
  });

  try {
    if (!emailUser) {
      return res.status(404).json({
        message: "존재하지 않는 회원입니다.",
      });
    }

    const hashPassword = crypto
      .pbkdf2Sync(password, user.salt, 2, 32, "sha512")
      .toString("hex");

    if (user.password !== hashPassword) {
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

    const hashPassword = crypto
      .pbkdf2Sync(password, user.salt, 2, 32, "sha512")
      .toString("hex");

    const newhashPassword = crypto
      .pbkdf2Sync(new_password, user.salt, 2, 32, "sha512")
      .toString("hex");

    if (user.password !== hashPassword) {
      res.status(400).json({
        message: "현재 비밀번호가 올바르지 않습니다.",
      });
    } else if (hashPassword === newhashPassword) {
      res.status(400).json({
        message: "현재 비밀번호와 같지 않도록 수정하세요.",
      });
    } else {
      await user.update({
        password: newhashPassword,
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

    const newhashPassword = crypto
      .pbkdf2Sync(new_password, user.salt, 2, 32, "sha512")
      .toString("hex");

    await user.update({
      password: newhashPassword,
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
    html: `<table cellpadding="0" cellspacing="0" border="0">
    <div style="display: flex; justify-content: center">
      <div style="margin-top: 3%; width: 600px">
        <div
          style="
            margin-left: 30px;
            width: 580px;
            display: flex;
            align-items: center;
          "
        >
          <img
            src="https://c11.kr/17hc9"
            alt="IMGLogo"
            style="width: 35px; height: 40px"
          />
          <img
            src="https://c11.kr/17hcb"
            alt="ECLine"
            style="margin-left: 15px; width: 1px; height: 43px"
          />
          <img
            src="https://c11.kr/17hcc"
            alt="TTextLogo"
            style="margin-left: 15px; width: 190px; height: 30px"
          />
        </div>

        <div style="margin-top: 40px">
          <div
            style="
              display: flex;
              font-weight: 600;
              font-size: 26.5px;
              font-family: Pretendard;
              font-style: normal;
            "
          >
            이메일
            <p
              style="
                margin-top: 0px;
                margin-right: 0px;
                margin-bottom: 0px;
                margin-left: 6px;
                background-color: #fde293;
                font-weight: 600;
                font-size: 26.5px;
                font-family: Pretendard;
                font-style: normal;
              "
            >
              인증
            </p>
            코드
          </div>

          <div style="margin-top: 40px">
            <div>
              <div>
                <p
                  style="
                    font-weight: 500;
                    font-family: Noto Sans;
                    font-style: normal;
                  "
                >
                  안녕하세요.
                </p>
                <p
                  style="
                    font-weight: 500;
                    margin-top: 22.5px;
                    font-family: Noto Sans;
                    font-style: normal;
                  "
                >
                  SinnaBro에서 회원님의 신원을 확인하려면 이메일 주소를
                  인증해야 합니다.
                </p>
                <p
                  style="
                    margin: 0;
                    font-weight: 500;
                    margin-top: 22.5px;
                    font-family: Noto Sans;
                    font-style: normal;
                  "
                >
                  이 코드는 한 번만 사용할 수 있습니다. 다른 사람과 이 코드를
                  공유하지 마세요.
                </p>
                <p
                  style="
                    font-weight: 500;
                    margin-top: 5.6px;
                    font-family: Noto Sans;
                    font-style: normal;
                  "
                >
                  만약 코드를 요청하지 않으셨다면 이 이메일을 무시해 주세요.
                </p>
              </div>

              <div
                style="
                  margin-top: 40px;
                  height: 150px;
                  display: flex;
                  justify-content: center;
                  background-color: #f9f9fe;
                  border-width: 1px;
                  border-color: #d9d9d9;
                  border-style: solid;
                  border-radius: 5px;
                "
              >
              <p
              style="
                margin-top: 45px;
                font-size: 52px;
                font-weight: 400;
                font-family: Noto Sans;
                font-style: normal;
              "
              
            >

            ${number}

</p>
              </div>
              <div
                style="
                  margin-top: 10px;
                  display: flex;
                  justify-content: center;
                  font-size: 20px;
                  font-weight: 600;
                  font-family: Pretendard;
                  font-style: normal;
                "
              >
                이메일
                <p
                  style="
                    margin-top: 0px;
                    margin-right: 0px;
                    margin-bottom: 0px;
                    margin-left: 6px;
                    background-color: #fde293;
                    font-size: 20px;
                    font-weight: 600;
                    font-family: Pretendard;
                    font-style: normal;
                  "
                >
                  인증
                </p>
                코드
              </div>

              <p
                style="
                  margin-top: 35px;
                  font-weight: 500;
                  font-family: Noto Sans;
                  font-style: normal;
                "
              >
                감사합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </table>`,
  };

  await Transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);

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

const MypageUser = async (req, res) => {
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

const MypageLike = async (req, res) => {
  const { year, month } = req.body;

  try {
    const dateList = await Time.findAll({
      where: {
        date: { [Op.startsWith]: `${year}-${month}` },
      },
      raw: true,
      attributes: ["date", "like"],
    });

    return res.status(200).json({
      message: "월별 스터디 좋아요 수를 조회합니다.",
      dateList,
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
  MypageUser,
  MypageLike,
};
