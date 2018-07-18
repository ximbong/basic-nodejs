const nodemailer = require("nodemailer");

const sendEmail = (email, firstname, lastname) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "haitruong181096@gmail.com",
      pass: "" //enter password here
    }
  });

  const mailOptions = {
    from: "haitruong181096@gmail.com",
    to: email,
    subject: "That was easy!",
    text: `Your name is ${firstname} ${lastname}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
