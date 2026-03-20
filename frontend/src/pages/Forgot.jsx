import {Link} from 'react-router'
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { useFetch } from '../hooks/useFetch'


export const Forgot = () => {

    const {register, handleSubmit, formState: {errors}} = useForm()
    const fetchDataBackend = useFetch()

    const sendMail = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/recuperar-password`
        await fetchDataBackend(url,dataForm, 'POST')
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen">
            <ToastContainer/>
            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">

                <div className="md:w-4/5 sm:w-full">

                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase  text-gray-500">Olvidaste tu contraseña?</h1>
                    {/* Formulario */}
                    <form onSubmit = {handleSubmit(sendMail)}>
                        {/* Campo: Correo electrónico o nombre de usuario */}
                        <div className="mb-1">
                            <label className="mb-2 block text-sm font-semibold">Nombre de usuario o correo</label>
                            <input type="text" placeholder="Ingresa tu correo electrónico o nombre de usuario" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            {...register("identifier", {required: "El campo debe ser llenado de forma obligatoria."})}
                            />
                            {errors.email && <p className = "text-red-800">{errors.email.message}</p>}
                        </div>

                        {/* Botón forgot password */}
                        <div className="mb-3">
                            <button className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white">
                                Enviar
                            </button>
                        </div>

                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4 ">
                    </div>

                    {/* Enlace para iniciar sesión */}
                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿Ya tienes una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Iniciar sesión</Link>
                    </div>

                </div>

            </div>

            {/* Imagen */}
            <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/public/images/catforgot.jpg')] 
            bg-no-repeat bg-cover bg-center sm:block hidden
            ">
            </div>
        </div>
    )
}