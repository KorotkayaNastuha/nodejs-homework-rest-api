const sgMail = require('@sendgrid/mail');
require("dotenv").config();

const {SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
    try {
        const email = { ...data, from: "korotchuknastya71@gmail.com" }
        await sgMail.send(email)
        console.log("Email send success")
        return true
        
    } catch (error) {
        throw error
    }
    
}

module.exports = { sendEmail }
