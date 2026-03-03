// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';

import authRouter from './routers/auth_routes.js'

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 


// Middlewares 
app.use(express.json())
app.use(cors())


// Variables globales
app.set('port',process.env.PORT || 3000)


// Ruta principal
app.get('/',(req,res)=> res.send("Server on"))

// Rutas para la autenticación de usuarios
app.use('/api/auth', authRouter)

// Manejo de una ruta que no sea encontrada
app.use((req,res) => res.status(404).send("Error 404: Endpoint no encontrado."))

// Exportar la instancia de express por medio de app
export default  app