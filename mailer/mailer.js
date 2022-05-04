const nodemailer = require("nodemailer");

const mailConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'lorenz.oberbrunner58@ethereal.email',
      pass: 'zj6fYrf21cpCPUayGR'
  }
};

module.exports = nodemailer.createTransport(mailConfig);
