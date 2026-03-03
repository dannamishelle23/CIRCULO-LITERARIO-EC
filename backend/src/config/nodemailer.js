import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    secure: true,          
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    },
})

//Función genérica para enviar correos
const sendMail = async (to,subject,html) => {
    try {
        const info = await transporter.sendMail({
            from: '"CIRCULO LITERARIO EC 📚" <admin.circuloliterario@gmail.com>', 
            to,
            subject,
            html,
        })
        console.log("Email enviado con éxito: ", info.messageId)
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error.message)

    }
}

export default sendMail