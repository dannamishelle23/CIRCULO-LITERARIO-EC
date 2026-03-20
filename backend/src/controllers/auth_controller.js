import Usuarios from "../models/Usuarios.js"
import { sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

//Endpoint para recuperar contraseña
const recuperarPassword = async(req,res) => {
    try {
        const {identifier} = req.body
        if (!identifier) return res.status(400).json({msg: "Debes ingresar tu correo o nombre de usuario."})
        const usuario = await Usuarios.findOne({
          $or: [
            {email: identifier},
            {username: identifier}
          ]
        })
        //Estrategia de seguridad (no revelar si el username o el correo existen o no en la BDD)
        if (!usuario) {
          return res.status(200).json({msg: "Si el usuario existe, recibirás un correo para reestablecer tu contraseña."})
        }
        const token = usuario.createToken()
        usuario.token = token
        await usuario.save()
        await sendMailToRecoveryPassword(usuario.email,token)
        res.status(200).json({msg: "Si el usuario existe, recibirás un correo electrónico para reestablecer tu contraseña."})
    } catch(error) {
        console.error(error)
        res.status(500).json({msg: `Error al procesar la solicitud - ${error}`})
    }
}

const comprobarTokenPassword = async(req,res) => {
  try {
    const {token} = req.params
    const usuarioBDD = await Usuarios.findOne({token})
    if(!usuarioBDD) return res.status(400).json({msg: "No se pudo validar su cuenta. El token es inválido o ya expiró."})
    return res.status(200).json({
      msg: "Token confirmado, ya puedes crear tu nueva contraseña."})
  } catch (error) {
        console.error(error)
        res.status(500).json({msg: `Error al procesar la solicitud - ${error}`})
  }
}

//Crear nueva contraseña
const crearNuevoPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body
    const { token } = req.params

    if (!password || !confirmPassword) {
      return res.status(400).json({
        msg: "Debes llenar todos los campos de forma obligatoria."
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        msg: "La contraseña debe tener mínimo 6 caracteres."
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        msg: "Las contraseñas no coinciden."
      })
    }

    const usuario = await Usuarios.findOne({ token })

    if (!usuario) {
      return res.status(400).json({
        msg: "Token inválido o expirado."
      })
    }

    usuario.password = await usuario.encryptPassword(password)
    usuario.token = null

    await usuario.save()

    return res.status(200).json({
      msg: "Contraseña restablecida exitosamente. Ya puedes iniciar sesión."
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      msg: "Error al procesar la solicitud."
    })
  }
}

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({
        msg: "Debes completar todos los campos."
      })
    }

    // Buscar al usuario por email o username
    const usuarioBDD = await Usuarios.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    }).select("-__v -token -updatedAt")

    if (!usuarioBDD) {
      return res.status(401).json({
        msg: "Correo, nombre de usuario o contraseña incorrectos."
      })
    }
    if (!usuarioBDD.confirmEmail) {
      return res.status(403).json({
        msg: "Debes verificar tu cuenta antes de iniciar sesión."
      })
    }

    if (usuarioBDD.estadoUsuario !== "Activo") {
      return res.status(403).json({
        msg: "Tu cuenta no está disponible."
      })
    }

    const verificarPassword = await usuarioBDD.matchPassword(password)

    if (!verificarPassword) {
      return res.status(401).json({
        msg: "Correo, nombre de usuario o contraseña incorrectos."
      })
    }

    const { nombres, apellidos, provincia, username, _id, rol, email } = usuarioBDD
    const token = crearTokenJWT(usuarioBDD._id, usuarioBDD.rol)

    return res.status(200).json({
      msg: "Inicio de sesión exitoso.",
      usuario: {
        _id,
        token,
        nombres,
        apellidos,
        provincia,
        username,
        email,
        rol
      }
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({msg: "Error al procesar solicitud."})
  }
}

//Creación de endpoint para visualizar su perfil
const perfil = (req,res) => {
  //Quitar las variables del objeto que se envía al frontend
  const {token, confirmEmail, createdAt, updatedAt, __v, ...datosPerfil} = req.usuarioHeader
  res.status(200).json(datosPerfil)
}

//Creación de endpoint para actualizar el perfil 
const actualizarPerfil = async(req,res) => {
  try {
    const {id} = req.params
    const {nombres, apellidos, provincia, username, email} = req.body
    if ( !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg: `ID inválido: ${id}`})
    const usuarioBDD = await Usuarios.findById(id)
    if (!usuarioBDD) return res.status(404).json({msg: `No existe el usuario con el ID ${id}`})
    if (Object.values(req.body).includes("")) return res.status(400).json({msg: "Debes completar todos los campos."})
    if (usuarioBDD.email !== email)
    {
      const emailExistente = await Usuarios.findOne({email})
      if (emailExistente) {
        return res.status(404).json({msg: "El email ya se encuentra registrado."})
      }
    }
    usuarioBDD.nombres = nombres ?? usuarioBDD.nombres
    usuarioBDD.apellidos = apellidos ?? usuarioBDD.apellidos
    usuarioBDD.provincia = provincia ?? usuarioBDD.provincia
    usuarioBDD.username = username ?? usuarioBDD.username
    usuarioBDD.email = email ?? usuarioBDD.email
  } catch (error) {
    console.error(error)
    res.status(500).json({msg: `Error en el servidor - ${error}`})
  }
}

//Creación de endpoint para actualizar la contraseña
const actualizarPassword = async(req,res) => {
  try {
    const usuarioBDD = await Usuarios.findById(req.usuarioHeader._id)
    if (!usuarioBDD) return res.status(404).json({msg: `Lo sentimos, no existe el usuario con el ID: ${id}`})
    const verificarPassword = await usuarioBDD.matchPassword(req.body.passwordActual)
    if (!verificarPassword) return res.status(404).json({msg: "Lo sentimos, la contraseña actual no es correcta."})
    usuarioBDD.password = await usuarioBDD.encryptPassword(req.body.passwordNuevo)
    await usuarioBDD.save()
  
  res.status(200).json({msg: "Contraseña actualizada con éxito."})
  } catch (error) {
    res.status(500).json({msg: `Error en el servidor - ${error}`})
  }
}

export {
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword
}