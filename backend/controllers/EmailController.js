const nodemailer = require('nodemailer');
const path = require("path")
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587, 
    secure: true,
    auth: {
        user: 'yram.netclues@gmail.com',
        pass: 'msro kdoh nwav dgll'
    }
});

const sendEmail = (document, length) => {
    const mailOptions = {
        from: 'Yash Ahir <yram.netclues@gmail.com>',
        to: "yram.netclues@gmail.com",
        subject: 'Regarding Eamil Sending',
        text: `This ${document.filename} contains ${length} rows`,
        attachments: [
            {
                filename: document.filename,
                path: path.join(__dirname, '../uploads/' + document.filename)
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = {sendEmail};
