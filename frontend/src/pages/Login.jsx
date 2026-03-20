import { useState } from 'react';
import { MdVisibility, MdVisibilityOff, MdAutoStories, MdEmail, MdLockOpen, MdArrowBack } from "react-icons/md";
import { Link, useNavigate } from 'react-router';
import { useFetch } from '../hooks/useFetch';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const fetchDataBackend = useFetch();

    const loginUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
        const response = await fetchDataBackend(url, dataForm, 'POST');
        if (response) {
            navigate('/dashboard');
        }
    };

    const inputStyle = "block w-full pl-10 rounded-lg border border-gray-200 bg-white py-3 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-sm";
    const labelStyle = "mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest";
    const errorStyle = "text-xs text-red-500 mt-1 font-semibold italic";

    return (
        <div className="flex h-screen bg-white font-sans overflow-hidden text-[#2c3e50]">
            <ToastContainer />

            {/* LADO IZQUIERDO: IMAGEN LITERARIA */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div className="absolute inset-0 bg-[#2c3e50]/70 mix-blend-multiply z-10"></div>
                <img 
                    src="/images/librosfondo.jpeg" 
                    alt="Biblioteca" 
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center p-16 z-20 text-white">
                    <span className="bg-[#e67e22] w-20 h-1 mb-6"></span>
                    <h2 className="text-5xl font-black leading-tight uppercase tracking-tighter">
                        Tu Próximo <br /> Capítulo <br /> Comienza Aquí
                    </h2>
                </div>
            </div>

            {/* FORMULARIO */}
            <div className="w-full lg:w-1/2 flex flex-col relative bg-white overflow-y-auto">
                
                <div className="absolute top-6 left-8 z-30">
                    <Link to="/" className="flex items-center text-sm font-bold text-gray-400 hover:text-[#2c3e50] transition-all group">
                        <MdArrowBack className="mr-2 group-hover:-translate-x-1 transition-transform" size={20}/> 
                        Regresar
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 py-12">
                    <div className="w-full max-w-md">
                        
                        {/* Header Identidad */}
                        <header className="text-center mb-8 mt-4">
                            <div className="flex justify-center mb-3 text-[#e67e22]">
                                <MdAutoStories size={45} />
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter">
                                Bienvenido<span className="text-[#e67e22]">(a)</span>
                            </h1>
                            <p className="text-gray-400 mt-1 font-medium italic text-sm">
                                Accede a la comunidad de Círculo Literario EC
                            </p>
                        </header>

                        <form onSubmit={handleSubmit(loginUser)} className="space-y-5">
                            <div>
                                <label className={labelStyle}>Correo o Usuario</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-3 top-3.5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="ejemplo@correo.com" 
                                        className={inputStyle}
                                        {...register("identifier", { required: "El usuario es obligatorio" })}
                                    />
                                </div>
                                {errors.identifier && <p className={errorStyle}>{errors.identifier.message}</p>}
                            </div>

                            <div>
                                <label className={labelStyle}>Contraseña</label>
                                <div className="relative">
                                    <MdLockOpen className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="************"
                                        className={inputStyle}
                                        {...register("password", { required: "La contraseña es obligatoria" })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#e67e22]"
                                    >
                                        {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
                                <div className="flex justify-end mt-2">
                                    <Link to="/forgot/id" className="text-xs font-bold text-gray-400 hover:text-[#e67e22] transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>

                            <button className="w-full bg-[#e67e22] text-white font-black py-4 rounded-xl shadow-lg shadow-orange-100 hover:bg-[#d35400] hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm">
                                Iniciar Sesión
                            </button>
                        </form>

                        <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
                            <hr className="border-gray-200" />
                            <span className="text-center text-[10px] font-bold uppercase tracking-[0.2em]">O inicia sesión con</span>
                            <hr className="border-gray-200" />
                        </div>

                        <button className="bg-white border border-gray-200 py-3 w-full rounded-xl mt-5 flex justify-center items-center text-sm font-bold text-[#2c3e50] hover:bg-gray-50 transition-all shadow-sm">
                            <img className="w-5 mr-3" src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
                            Google
                        </button>

                        {/* SECCIÓN DE REGISTRO */}
                        <div className="mt-10 p-5 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                            <p className="text-sm text-gray-600 font-medium mb-2">¿Aún no eres parte del club?</p>
                            <Link to="/register" className="text-[#e67e22] font-black uppercase tracking-widest text-sm hover:text-[#d35400] transition-colors inline-block border-b-2 border-[#e67e22]">
                                Regístrate Gratis Aquí
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;