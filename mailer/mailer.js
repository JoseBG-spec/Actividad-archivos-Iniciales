const nodemailer = require('nodemailer')

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kaylie.gutkowski13@ethereal.email',
        pass: 'Prmc5MWfUGCAXQP429'
    }
}

module.exports = nodemailer.createTransport(mailConfig)
