const nodemailer = require('nodemailer');

function send(sender,password, receiver,theme,message){
    let mailData = {
        from: sender,
        to: receiver,
        subject: theme,
        text: message
    }
    nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        service: 'gmail',
        auth: {
            user: sender,
            pass: password,
        }
    }).sendMail(mailData, (err,info) => {
        if(err) return console.log(err)
        else console.log('Email send successful')
    })
}

module.exports = send;