import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas/auth.js';
import { useAuth } from '../context/authContext';
import { useEffect } from 'react';
import styles from '../css/login.module.css';

export const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema)
    });
    const navigate = useNavigate();
    const {  signin, IsAuthenticated, loginerrors} = useAuth();
    
    

    const onSubmit = handleSubmit(async (values) => {
        signin(values);
    })

    useEffect(() => {

        if(IsAuthenticated) navigate("/panel");
    },[IsAuthenticated]);

        

    return (
        <div className={styles.login}>
            <div className={styles.container} id='main'>
                {loginerrors && <div className=" bg-danger mt-2 me-2 text-white shadow">{loginerrors}</div>}
                <div className={styles['sign-in']}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.forml}>
                        <h1 className={styles.h1l}>Ingresar</h1>
                        <div class={styles['social-container']}>
                            <a href="#" className={styles['social', 'al']}><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className={styles['social', 'al']}><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className={styles['social', 'al']}><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <input className={styles.inputl}
                               type="email" 
                               name="CORREO" 
                               placeholder="E-Mail" 
                               {...register("CORREO", { required: true, message: "campo requerido" })}/>
                        {errors.CORREO && <div className=" bg-danger mt-2 me-2 text-white shadow">{errors.CORREO.message}</div>}
                        <input className={styles.inputl}
                               type="password" 
                               name="CONTRASENIA" 
                               placeholder="Contraseña" 
                               {...register("CONTRASENIA", { required: true, message: "campo requerido" })}/>
                        {errors.CONTRASENIA && <div className=" bg-danger mt-2 me-2 text-white shadow">{errors.CONTRASENIA.message}</div>}
                        <Link to="/reset"><a href="#">Olvidaste tu contraseña?</a></Link>
                        <button type='submit' className={styles.buttonl}>Iniciar Sesión!</button>
                    </form>
                </div>
                <div className={styles['overlay-container']}>
                    <div className={styles.overlay}>
                        <div className={styles['overlay-right']}>
                        <h1 className={styles.h1l}>Nuevo en CLEAR?</h1>
                        <p>Ingresa tus datos y registrate con nosotros</p>
                        <Link to="/register"><button className={styles.buttonl} id={styles.signUp}>Registrarse</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

