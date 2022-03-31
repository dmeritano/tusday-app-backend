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
        html:`<p>Hola ${name}</p>
        <p>Please confirm your account in TusDay in order to grant access to the application</p>
        <p>Click on the following link or copy and paste it into your browser:</p> 
        
        <a href="${process.env.FRONTEND_URL}/confirm/${token}">Activate your account!</a>
        
        <p>If you did not create this account you can ignore this message</p>

        <p>Regards</p>
        <p style="font-weight: 900; color:#EA580C;font-size: large;">TusDay Team</p>
        `
    })

}
/*

Hola David Meritano please confirm your account in TusDay in order grant your access to de application

Click on the following link or copy and paste it into your browser:

Activate your account!
Si tu no creaste esta cuenta puedes ignorar este mensaje

Regards

TusDay Team


*/

//Private functions
const getMailTransport = () => {
    return nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "81f0b1dded55df",
          pass: "b72112563fd768"
        }
      })
}


export { generateId, generateJWT, sendEmailUserRegister }

