const nodemailer = require("nodemailer");
const path = require("path");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    // user: "kbhatla.netclues@gmail.com",
    user: "kunallaptop72@gmail.com",
    pass: "cecx axze bpqh idsg",
  },
});

const sendEmail = (document, rows, duplicateRecords) => {
  const mailOptions = {
    from: "kbhatla.netclues@gmail.com",
    to: "kbhatla.netclues@gmail.com",
    subject: "Kunal send you the mail regarding your file...!",
    text: `This ${
      document.filename
    } contains total ${rows} rows and you have total ${
      duplicateRecords.length
    } duplicate entry so your valid ${
      rows - duplicateRecords.length
    } records are inserted`,
    attachments: [
      {
        filename: document.filename,
        path: path.join(__dirname, "../uploads/" + document.filename),
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendEmail };
