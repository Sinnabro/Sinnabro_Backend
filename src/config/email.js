require("dotenv").config();
const nodemailer = require("nodemailer");

const Transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: process.env.USEREMAIL,
        pass: process.env.USEREMAILPASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    Transport
};