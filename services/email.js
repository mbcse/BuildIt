import nodemailer from 'nodemailer'
import config from '../config'
// mail sending config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: config.EMAIL.HOST,
  port: 587,
  secure: false,
  socketTimeout: 5000000,
  logger: true,
  auth: {
    user: config.EMAIL.USER,
    pass: config.EMAIL.PASS
  },
  tls: {
    secureProtocol: 'TLSv1_method',
    rejectUnauthorized: false
  }
})

export const sendEmail = async (from, to, subject, msg) => {
  const mail = {
    from,
    to,
    subject,
    text: msg
  }

  transporter.sendMail(mail, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
