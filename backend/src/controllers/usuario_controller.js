import Usuarios from 'Usuarios.js'
import { sendMailToRegister } from '../helpers/sendMail.js'

//Registro del usuario
const registro = async(req,res) => {
  try { 
    const {email, username, password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg: "Todos los campos deben ser completados de forma obligatoria."})
    const usuarioExistente = await Usuarios.findOne({
      $or: [
        {email}, 
        {username}
      ]
    })
    if (usuarioExistente) {
      return res.status(400).json({msg: "El correo o el nombre del usuario ya se encuentran registrados."})
    }
    //Forzar el rol de Usuario para evitar que se envíen otros roles desde el frontend
    const nuevoUsuario = new Usuarios({
      ...req.body,
      rol: "Usuario"
    })
    nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)
    const token = nuevoUsuario.createToken()
    nuevoUsuario.token = token
    await nuevoUsuario.save()
    await sendMailToRegister(email,token)
    res.status(200).json({msg: "Revisa tu correo electrónico para confirmar tu cuenta."})
  } catch (error) {
        res.status(500).json({msg: `Error en el servidor - ${error}`})
    }
}

//Confirmación de email para el inicio de sesión
const confirmarMail = async(req,res) => {
  try {
    const {token} = req.params
    const usuarioBDD = await Usuarios.findOne({token})
    if (!usuarioBDD) return res.status(404).json({msg: "Token inválido o cuenta ya confirmada."})
    usuarioBDD.token = null
    usuarioBDD.confirmEmail = true
    await usuarioBDD.save()
    res.status(200).json({msg: "Cuenta confirmada, ya puedes iniciar sesión."})
  } catch (error) {
    console.error(error)
    res.status(500).json({msg: `Error al procesar la solicitud - ${error}`})
  }
}

export {
    registro,
    confirmarMail
}