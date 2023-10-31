const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // create a transporter
    // const transporter = nodemailer.createTransport({
    //     host: process.env.HOST,
    //     port: process.env.MAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // });
    
    // Fake SMTP, for PROD do change and move sensitive data to ENV
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'rhett50@ethereal.email',
            pass: 'Zy9XphnRWAzT9G2JAw'
        }
    });


    // define email options
    const mailOptions = {
        from: "iftipro@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html
    };

    // send email
    await transporter.sendMail(mailOptions);

};
module.exports = sendEmail;