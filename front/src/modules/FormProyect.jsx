import React from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { projectSchema } from '../schemas/project.js';
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react';
import { useProject } from "../context/projectContext.js";
import { useAuth } from "../context/authContext";
import Header from "./Header.jsx";

export const FormProyect = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(projectSchema)
    });

    const navigate = useNavigate();
    const { create, IsCreated, message, projecterrors, setProjecterrors ,setMessage} = useProject();
    const { user } = useAuth();


    const onSubmit = handleSubmit(async (values) => {
        const data = {
            NOMBRE_PROYECTO: values.NOMBRE_PROYECTO,
            OBJETIVO: values.OBJETIVO,
            DESCRIPCION_GNRL: values.DESCRIPCION_GNRL,
            FECHA_INICIO: values.FECHA_INICIO,
            FECHA_TERMINO: values.FECHA_TERMINO,
            ENTREGAS: values.ENTREGAS,
            ID: user.ID
        }
        create(data);
    })

    useEffect(() => {
        setProjecterrors([]);
        setMessage([]);
        if (IsCreated) navigate("/panel");
    }, [IsCreated]);

    return (
        <div>
            <Header />
            <div className="relative flex flex-col justify-center min-h-svh overflow-hidden">

                <div className="w-full p-3 m-auto bg-white rounded-md shadow-xl ring-indigo-600 lg:max-w-xl">
                    {message && <div class=" items-center bg-green-100 border-l-4 border-green-500 text-green-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
                        <p class="text-lg font-semibold m-2">{message}</p>
                    </div>
                    }
                    {projecterrors && <div class=" items-center bg-red-100 border-l-4 border-red-500 text-red-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
                        <p class="text-lg font-semibold m-2">{projecterrors}</p>
                    </div>
                    }
                    <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase mt-3">
                        Crea tu Proyecto
                    </h1>
                    <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2">
                            <label className="block text-sm font-semibold text-gray-800">
                                Titulo del proyecto:
                            </label>
                            <input
                                className="block w-full px-4 py-2 mt-2 text-black-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                type="text"
                                name="NOMBRE_PROYECTO"
                                placeholder='Título'
                                {...register("NOMBRE_PROYECTO", { required: true, message: "Campo requerido" })}
                            />
                            {errors.NOMBRE_PROYECTO && <div className=" bg-danger mt-2 me-2 text-white shadow">{errors.NOMBRE_PROYECTO.message}</div>}
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-semibold text-gray-800">
                                Descripcion del proyecto:
                            </label>
                            <textarea
                                className=" block w-full px-4 py-2 mt-2 text-black-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 "
                                style={{ height: "75px" }}
                                placeholder="Descripción del proyecto"
                                name="DESCRIPCION_GNRL"
                                {...register("DESCRIPCION_GNRL", { required: true, message: "Campo requerido" })}
                            />
                            {errors.DESCRIPCION_GNRL && <div className=" bg-danger mt-2 me-2 text-white shadow">{errors.DESCRIPCION_GNRL.message}</div>}
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-semibold text-gray-800">
                                Objetivo del proyecto:
                            </label>
                            <textarea
                                className=" block w-full px-4 py-2 mt-2 text-black-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40 "
                                style={{ height: "75px" }}
                                placeholder="Objetivo del proyecto"
                                name="OBJETIVO"
                                {...register("OBJETIVO", { required: true, message: "Campo requerido" })}
                            />
                            {errors.OBJETIVO && <div className=" bg-danger mt-2 me-2 text-white shadow">{errors.OBJETIVO.message}</div>}
                        </div>

                        <div className="mb-2 items-center">
                            <div className="flex flex-row ">
                                <div className='flex-row mr-2'>
                                    <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                                        Fecha de Inicio:
                                    </label>
                                    <input
                                        className="block w-full px-4 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                        type="date"
                                        name="FECHA_INICIO"
                                        {...register("FECHA_INICIO", { required: true, message: "Campo requerido" })}

                                    />
                                    {errors.FECHA_INICIO && <div className=" bg-danger mt-2 me-2 text-white shadow">{errors.FECHA_INICIO.message}</div>}

                                </div>
                                <div className="flex-row mr-2">
                                    <label htmlFor="FECHA_TERMINO" className="block text-sm font-semibold text-gray-800">
                                        Fecha de finalización:
                                    </label>
                                    <input
                                        className="block w-full px-4 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                        type="date"
                                        name="FECHA_TERMINO"
                                        {...register("FECHA_TERMINO", { required: true, message: "Campo requerido" })}
                                    />
                                    {errors.FECHA_TERMINO && <div className=" bg-danger mt-2 me-2 text-white shadow">{errors.FECHA_TERMINO.message}</div>}
                                </div>
                                <div className="flex-row  mr-2">
                                    <label htmlFor="ENTREGAS" className="block text-sm font-semibold text-gray-800">
                                        Entregas del proyecto:
                                    </label>
                                    <select
                                        className="block w-full px-3 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                        name="ENTREGAS"
                                        {...register("ENTREGAS", { required: true, message: "Campo requerido" })}
                                    >
                                        <option selected>Entregas</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <input
                                type="submit"
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                                value="Crear"
                            />
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}

export default FormProyect;