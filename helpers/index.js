import nodemailer from "nodemailer"
//Helpers functions 
import jwt from "jsonwebtoken"

const generateId = () => {
    const rnd = Math.random().toString(32).substring(2)
    const date = Date.now().toString(32)
    return rnd +  date
}

const generateJWT = (id) => {

    return jwt.sign( { id }, process.env.JWT_SECRET,{ expiresIn:'30d' })

}

const sendEmailUserRegister = async (data) => {    
    const {email, name, token} = data
    const transport = getMailTransport()
    const info = await transport.sendMail({
        from: '"TusDay - Project Administrator" <cuentas@tusday.com>',
        to:email,
        subject:"TusDay - Account confirmation",
        text:"Confirm your account",
        html:`<p>Hello ${name}</p>
        <p>Please confirm your account in TusDay in order to grant access to the application</p>
        <p>Click on the following link or copy and paste it into your browser:</p> 
        
        <a href="${process.env.FRONTEND_URL}/account-confirm/${token}">Activate your account!</a>
        
        <p>If you did not create this account you can ignore this message</p>

        <p>Regards</p>
        <p style="font-weight: 900; color:#EA580C;font-size: large;">TusDay Team</p>
        `
    })
}

const sendEmailResetPassword = async (data) => {

    const {email, name, token} = data
    const transport = getMailTransport()
    const info = await transport.sendMail({
        from: '"TusDay - Project Administrator" <cuentas@tusday.com>',
        to:email,
        subject:"TusDay - Reset your password",
        text:"Reset your password",
        html:`<p>Hello ${name}</p>
        <p>You have requested to reset your password</p>
        <p>Click on the following link or copy and paste it into your browser to generate a new one:</p> 
        
        <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset!</a>
        
        <p>If you did not request this email you can ignore this message</p>

        <p>Regards</p>
        <p style="font-weight: 900; color:#EA580C;font-size: large;">TusDay Team</p>
        `
    })
}

//Private functions
const getMailTransport = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })
}


export { generateId, generateJWT, sendEmailUserRegister, sendEmailResetPassword }

