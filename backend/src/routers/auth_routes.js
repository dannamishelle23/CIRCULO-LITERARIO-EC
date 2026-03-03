import {Router} from 'express'
import { comprobarTokenPassword, crearNuevoPassword, login, recuperarPassword } from '../controllers/auth_controller.js'

const router = Router()

//Rutas para la recuperación de contraseña
router.post('/recuperar-password', recuperarPassword)
router.get('/recuperar-password/:token', comprobarTokenPassword)
router.post('/nuevo-password/:token', crearNuevoPassword)
router.post('/login',login)

export default router