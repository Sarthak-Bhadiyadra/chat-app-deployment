const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async function (email: string, name: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "bennie45@ethereal.email",
      pass: "Hv7mzmy4Gs2nDbcy74",
    },
  });
  console.log("transporter: ", transporter);
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "sarthakb@mailinator.com", // sender address
    to: `${email}`, // list of receivers
    subject: "user created successfully", // Subject line
    text: `Hello ${name} : Welcome to user Managment System`, // plain text body
    html: `<b>Hello ${name} : Welcome to user Managment System login to see all the activity</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
};

export { sendMail };
