import { registerSchema } from "../schemas/auth";
import { useAuth } from '../context/authContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../css/register.module.css"
import Header from './Header.jsx';

export const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const { signup, IsAuthenticated, autherrors, setAutherrors, setMessage, message } = useAuth();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (values) => {
        signup(values);
    })

    useEffect(() => {
        setMessage([]);
        setAutherrors([]);
        if (IsAuthenticated) navigate("/panel");
    }, [IsAuthenticated]);


    return (
        <div>
            <Header />

            <div className={styles.register}>

                <div className={styles.containerr} id='main'>
                    {message && <div class=" items-center bg-green-100 border-l-4 border-green-500 text-green-700  rounded-lg m-2 md:m-10 p-2 md:p-10 shadow-md" style={{ maxWidth: '600px' }}>
                        <p class="text-lg font-semibold">{message}</p>
                    </div>
                    }
                    {autherrors && <div class=" items-center bg-red-100 border-l-4 border-red-500 text-red-700  rounded-lg m-2 md:m-10 p-2 md:p-10 shadow-md" style={{ maxWidth: '600px' }}>
                        {autherrors}
                    </div>
                    }
                    {errors.refine && <div className=" bg-danger mt-2 me-2 text-white shadow">{errors.refine.message}</div>}
                    <div className={styles['overlay-containerr']}>
                        <div className={styles.overlayr}>
                            <div className={styles['overlay-rightr']}>
                                <h1 className={styles.h1r}>Ya tienes una cuenta?</h1>
                                <p>Inicia Sesión para volver al trabajo </p>
                                <Link to="/login"><button className={styles.buttonr} id={styles.signInr}>Iniciar Sesión</button></Link>
                            </div>
                        </div>

                    </div>
                    <div className={styles['sign-inr']}>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.formr}>
                            <h1 className={styles.h1r}>Crear Cuenta</h1>
                            <div>
                                <input className={styles.inputr}
                                    type="text"
                                    name="NOMBRE_PILA"
                                    placeholder="Nombre(s)"
                                    {...register("NOMBRE_PILA", { required: true })} />
                                {errors.NOMBRE_PILA &&
                                    <div className=" col-5 ps-3">
                                        <div className=" bg-danger mt-2  text-white shadow fs-6">{errors.NOMBRE_PILA.message}</div>
                                    </div>}
                            </div>
                            <div>
                                <input className={styles.inputr}
                                    type="text"
                                    name="APELLIDO_PATERNO"
                                    placeholder="Apellido Paterno"
                                    {...register("APELLIDO_PATERNO", { required: true })} />
                                {errors.APELLIDO_PATERNO &&
                                    <div className=" col-5 pe-3">
                                        <div className=" bg-danger mt-2 text-white shadow ">{errors.APELLIDO_PATERNO.message}</div>
                                    </div>}
                            </div>
                            <div><input className={styles.inputr}
                                type="text"
                                name="APELLIDO_MATERNO"
                                placeholder="Apellido Materno"
                                {...register("APELLIDO_MATERNO", { required: true })} />
                                {errors.APELLIDO_MATERNO &&
                                    <div className=" col-5 ps-3">
                                        <div className=" bg-danger mt-2  text-white shadow fs-6">{errors.APELLIDO_MATERNO.message}</div>
                                    </div>}
                            </div>
                            <div><input className={styles.inputr}
                                type="text"
                                name="NUMERO_BOLETA"
                                placeholder="Número de Boleta "
                                {...register("NUMERO_BOLETA", { required: true })} />
                                {errors.NUMERO_BOLETA &&
                                    <div className=" col-5 pe-3">
                                        <div className=" bg-danger mt-2 text-white shadow ">{errors.NUMERO_BOLETA.message}</div>
                                    </div>}
                            </div>
                            <div><input className={styles.inputr}
                                type="text"
                                name="NOMBRE_USUARIO"
                                placeholder="Nombre de Usuario"
                                {...register("NOMBRE_USUARIO", { required: true })} />
                                {errors.NOMBRE_USUARIO &&
                                    <div className=" col-5 ps-3">
                                        <div className=" bg-danger mt-2  text-white shadow fs-6">{errors.NOMBRE_USUARIO.message}</div>
                                    </div>}
                            </div>
                            <div><input className={styles.inputr}
                                type="text"
                                name="TELEFONO"
                                placeholder="Número Celular"
                                maxLength="12"
                                {...register("TELEFONO", { required: true })} />
                                {errors.TELEFONO &&
                                    <div className=" col-5 pe-3">
                                        <div className=" bg-danger mt-2 text-white shadow ">{errors.TELEFONO.message}</div>
                                    </div>}
                            </div>
                            <div><input className={styles.inputr}
                                type="email"
                                name="CORREO"
                                placeholder="Correo Electrónico"
                                {...register("CORREO", { required: true })} />
                                {errors.CORREO &&
                                    <div className=" col-5 ps-3">
                                        <div className=" bg-danger mt-2  text-white shadow fs-6">{errors.CORREO.message}</div>
                                    </div>}
                            </div>
                            <div><input className={styles.inputr}
                                type="email"
                                name="repeatCORREO"
                                placeholder="Confirmar Correo Electrónico"
                                {...register("repeatCORREO", { required: true })} />
                                {errors.repeatCORREO &&
                                    <div className=" col-5 ps-3">
                                        <div className=" bg-danger mt-2  text-white shadow fs-6">{errors.repeatCORREO.message}</div>
                                    </div>}
                            </div>
                            <div><input className={styles.inputr}
                                type="password"
                                name="CONTRASENIA"
                                placeholder="Contraseña"
                                {...register("CONTRASENIA", { required: true })} />
                                {errors.CONTRASENIA &&
                                    <div className=" col-5 ps-3">
                                        <div className=" bg-danger mt-2  text-white shadow fs-6">{errors.CONTRASENIA?.message}</div>
                                    </div>}
                            </div>
                            <div><input className={styles.inputr}
                                type="password"
                                name="repeatCONTRASENIA"
                                placeholder="Confirmar Contraseña"
                                {...register("repeatCONTRASENIA", { required: true })} />
                                {errors.repeatCONTRASENIA &&
                                    <div className=" col-5 ps-3">
                                        <div className=" bg-danger mt-2  text-white shadow fs-6">{errors.repeatCONTRASENIA?.message}</div>
                                    </div>}
                            </div>
                            <button className={styles.buttonr} type="submit">Registrarse!</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;