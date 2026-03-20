import { useState } from "react";
import { MdVisibility, MdVisibilityOff, MdAutoStories, MdPerson, MdEmail, MdLocationCity, MdCake, MdLockOpen } from "react-icons/md";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { ToastContainer } from 'react-toastify';
import { useFetch } from "../hooks/useFetch";

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const fetchDataBackend = useFetch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const registerUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios`;
        await fetchDataBackend(url, dataForm, "POST");
    };

    // Clases de estilo basadas en la paleta del Círculo Literario
    const inputStyle = "block w-full pl-10 rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-sm";
    const labelStyle = "mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest";
    const errorStyle = "text-xs text-red-500 mt-1 font-semibold italic";

    return (
        <div className="flex h-screen bg-[#f8f9fa] font-sans overflow-hidden">
            <ToastContainer />

            {/* LADO IZQUIERDO: FORMULARIO (Scrollable) */}
            <div className="w-full lg:w-7/12 flex flex-col items-center overflow-y-auto px-6 py-12">
                <div className="w-full max-w-2xl">
                    
                    {/* Header con Identidad Visual */}
                    <header className="text-center mb-10">
                        <div className="flex justify-center mb-4 text-[#e67e22]">
                            <MdAutoStories size={50} />
                        </div>
                        <h1 className="text-3xl font-black text-[#2c3e50] uppercase tracking-tighter">
                            Círculo Literario <span className="text-[#e67e22]">EC</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium italic">
                            Tu próxima gran lectura comienza con un voto.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit(registerUser)} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        
                        <div className="border-b border-gray-100 pb-2 mb-4 text-[#2c3e50] font-bold text-sm uppercase">
                            Información del Lector / Autor
                        </div>

                        {/* Nombres y Apellidos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelStyle}>Nombres</label>
                                <div className="relative">
                                    <MdPerson className="absolute left-3 top-3 text-gray-400" />
                                    <input type="text" placeholder="Tus nombres" className={inputStyle} 
                                        {...register("nombres", { required: "Este campo es vital" })} />
                                </div>
                                {errors.nombres && <p className={errorStyle}>{errors.nombres.message}</p>}
                            </div>

                            <div>
                                <label className={labelStyle}>Apellidos</label>
                                <div className="relative">
                                    <MdPerson className="absolute left-3 top-3 text-gray-400" />
                                    <input type="text" placeholder="Tus apellidos" className={inputStyle}
                                        {...register("apellidos", { required: "Este campo es vital" })} />
                                </div>
                                {errors.apellidos && <p className={errorStyle}>{errors.apellidos.message}</p>}
                            </div>
                        </div>

                        {/* Provincia y Fecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelStyle}>Provincia</label>
                                <div className="relative">
                                    <MdLocationCity className="absolute left-3 top-3 text-gray-400" />
                                    <select className={inputStyle} {...register("provincia", { required: "Selecciona tu provincia" })}>
                                        <option value="">¿Desde dónde nos lees?</option>
                                        <option value="Pichincha">Pichincha</option>
                                        <option value="Guayas">Guayas</option>
                                        <option value="Pastaza">Pastaza</option>
                                        <option value="Azuay">Azuay</option>
                                    </select>
                                </div>
                                {errors.provincia && <p className={errorStyle}>{errors.provincia.message}</p>}
                            </div>

                            <div>
                                <label className={labelStyle}>Fecha de Nacimiento</label>
                                <div className="relative">
                                    <MdCake className="absolute left-3 top-3 text-gray-400" />
                                    <input type="date" className={inputStyle} 
                                        {...register("fechaNacimiento", { 
                                            required: "Fecha requerida",
                                            validate: (v) => (new Date().getFullYear() - new Date(v).getFullYear() >= 13) || "Debes tener al menos 13 años"
                                        })} />
                                </div>
                                {errors.fechaNacimiento && <p className={errorStyle}>{errors.fechaNacimiento.message}</p>}
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelStyle}>Nombre de usuario</label>
                                <div className="relative">
                                    <MdPerson className="absolute left-3 top-3 text-gray-400" />
                                    <input type="text" placeholder="Tu nombre de usuario" className={inputStyle} 
                                        {...register("username", { required: "El nombre de usuario es obligatorio." })}/>
                                </div>
                            </div>

                            <div>
                                <label className={labelStyle}>Correo Electrónico</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-3 top-3 text-gray-400" />
                                    <input type="email" placeholder="tu@correo.com" className={inputStyle} 
                                        {...register("email", { required: "El correo es obligatorio" })}/>
                                </div>
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className={labelStyle}>Contraseña de Acceso</label>
                            <div className="relative">
                                <MdLockOpen className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Crea una clave segura"
                                    className={inputStyle}
                                    {...register("password", { required: "Define una contraseña", minLength: {value: 8, message: "Mínimo 8 caracteres"} })}
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
                        </div>

                        <button className="w-full bg-[#e67e22] text-white font-black py-4 rounded-xl shadow-lg shadow-orange-200 hover:bg-[#d35400] hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest">
                            Unirme al Círculo
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">¿Ya eres parte de un club?</p>
                        <Link to="/login" className="mt-2 inline-block text-[#2c3e50] font-bold hover:text-[#e67e22] border-b-2 border-[#2c3e50] hover:border-[#e67e22] transition-all">
                            Inicia Sesión aquí
                        </Link>
                    </div>
                </div>
            </div>

            {/* IMAGEN LITERARIA */}
            <div className="hidden lg:block lg:w-5/12 relative">
                {/* Imagen de fondo */}
                <img 
                    src="/images/librosfondo.jpeg" 
                    alt="Club de Lectura" 
                    className="h-full w-full object-cover"
                />

                {/* Overlay en la imagen */}
                <div className="absolute inset-0 bg-[#2c3e50]/70 z-10"></div>

                {/* Texto sobre la imagen*/}
                <div className="absolute inset-0 flex flex-col justify-center p-12 z-20 text-white">
                    <span className="bg-[#e67e22] w-20 h-1 mb-4"></span>
                    <h2 className="text-5xl font-black leading-tight uppercase tracking-tighter shadow-sm">
                        Descubre <br /> Autores <br /> Nacionales
                    </h2>
                    <p className="text-xl mt-6 font-light italic max-w-md drop-shadow-lg">
                        La lectura es una conversación. Todos los clubes de lectura tienen un final, pero la amistad que surge de ellos es para siempre.
                    </p>
                </div>
            </div>
        </div>
    );
};