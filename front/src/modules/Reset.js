import {  useNavigate } from 'react-router-dom';
import Footer from "./Footer.js";
import { useForm } from 'react-hook-form'
import { resetSchema } from '../schemas/auth.js';
import { useAuth } from '../context/authContext.js';
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react';

export const Reset = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetSchema)
    });

    
    const navigate = useNavigate();
    const {reseterrors,  message, resetToken} = useAuth();

    const onSubmit = handleSubmit(async (values) => {
        resetToken(values);
    });
    
    /*useEffect(() => {
        if(IsSended) console.log(IsSended);
    },[IsSended]);*/
    

    return (
        // <div>
        //     <div className="container-fluid position-relative p-4 text-center">
        //     {message && <div className=" bg-success mt-2 me-2 text-white shadow">{message}</div>}
        //     {reseterrors && <div className=" bg-danger mt-2 me-2 text-white shadow">{reseterrors}</div>}
        //         <div className="col-md-4 px-2 p-lg-3 mx-auto my-5">
        //             <form className="shadow" onSubmit={handleSubmit(onSubmit)}>
        //             <label className="px-2 pt-4 pb-1 h4">Restablecer contraseña</label>
        //                 <div className="p-4 row align-items-center">
        //                     <label className="col">Introduzca el correo registrado: </label>
        //                     <input
        //                         type="email"
        //                         name="CORREO"
        //                         placeholder='alguien@example.com'
        //                         className="col"
        //                         {...register("CORREO", { required: true, message: "Campo requerido"})}
        //                     />
        //                     {errors.CORREO && <div className=" bg-danger mt-4 me-2 text-white shadow">{errors.CORREO.message}</div>}

        //                 </div>
        //                 <div className="px-1 pb-4 pt-2 col">
        //                     <input className=" btn btn-dark btn-custom btn-xs " type="submit" value="Enviar" />
        //                 </div>
        //             </form>
        //         </div>




            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                        CLEAR   
                    </a>
                    <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                        <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            ¿Olvidaste tu contraseña?
                        </h1>
                        {message && <div className=" bg-success mt-2 me-2 text-white shadow">{message}</div>}
                        {reseterrors && <div className=" bg-danger mt-2 me-2 text-white shadow">{reseterrors}</div>}
                        <p className="font-light text-gray-500 dark:text-gray-400">¡No te preocupes! ¡Simplemente ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña!</p>
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Introduce tu correo electronico</label>
                                <input type="email" name="CORREO" placeholder='alguien@example.com' className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  {...register("CORREO", { required: true, message: "Campo requerido"})}  />
                                {errors.CORREO && <div className=" bg-danger mt-4 me-2 text-white shadow">{errors.CORREO.message}</div>}
                            </div>

                            <button type="submit" value="enviar" className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">Recuperar contraseña</button>
                        </form>
                    </div>
                </div>
                </section>
        //</div>
    );
};

export default Reset;

