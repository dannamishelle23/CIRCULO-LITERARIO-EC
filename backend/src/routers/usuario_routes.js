import {Router} from 'express'
import {confirmarMail, registro} from '../controllers/usuario_controller.js'
const router = Router()

//Rutas para registro de usuarios y confirmación de cuenta
router.post('/usuarios', registro)
router.get('/confirmar/:token', confirmarMail)

export default router