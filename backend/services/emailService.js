const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"CardioPredict" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your CardioPredict account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #1a56a0; margin-bottom: 8px;">CardioPredict</h2>
                <p style="color: #64748b; font-size: 14px;">Email Verification</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                <p style="color: #1e293b;">Your verification code is:</p>
                <div style="background: #f8fafc; border: 2px dashed #1a56a0; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a56a0;">${otp}</span>
                </div>
                <p style="color: #64748b; font-size: 13px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                <p style="color: #94a3b8; font-size: 12px;">If you did not create a CardioPredict account, ignore this email.</p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail };