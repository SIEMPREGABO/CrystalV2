import React, { useEffect } from 'react'
import { useProject } from '../context/projectContext';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema } from '../schemas/project';

function AsignarTarea() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema)
  });
  // la funcion creatTask
  //Agregar a la tarea la tarea dependiente y el requerimiento que cumple y rol, a quien se asigna
  const { fechasproject, entregaactual, iteracionactual, createTask } = useProject();

  const onSubmit = handleSubmit(async (values) => {
    createTask(values);
  })



  return (

    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      {fechasproject[0].ESTADO === "En espera" &&
        <div>
          {entregaactual === "" &&
            <div className="w-full p-6 m-auto bg-white rounded-md  ring-indigo-600 lg:max-w-xl">
              no puedes asignar tareas aun
            </div>}
        </div>}

      {fechasproject[0].ESTADO === "En desarrollo" &&
        <div>
          {entregaactual !== "" &&
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl ring-indigo-600 lg:max-w-xl">
              <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase">
                Asigna una tarea
              </h1>
              <form className="mt-6" onSubmit={handleSubmit(onSubmit)} >  
                <div className="mb-2">
                  <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800">
                    Nombre de la tarea
                  </label>
                  <input
                    type="text"
                    name="NOMBRE"
                    placeholder='Nombre de la tarea'
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    {...register("NOMBRE", { required: true, message: "campo requerido" })}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-800">
                    Descripción
                  </label>
                  <textarea
                    name="DESCRIPCION"
                    placeholder='Descripción de la tarea'
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    rows="4"
                    {...register("DESCRIPCION", { required: true, message: "campo requerido" })}

                  ></textarea>
                </div>

                <div className="mb-2">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <div>
                      <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                        Fecha de inicio
                      </label>
                      <input
                        type="date"
                        name="FECHA_INICIO"
                        className="block w-full px-4 py-2 mt-6 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        {...register("FECHA_INICIO", { required: true, message: "campo requerido" })}

                      />
                    </div>
                    <div>
                      <label htmlFor="FECHA_TERMINO" className="block text-sm font-semibold text-gray-800">
                        Fecha de finalización
                      </label>
                      <input
                        type="date"
                        name="FECHA_TERMINO"
                        className="block w-full px-2 py-2 mt-6 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        {...register("FECHA_TERMINO", { required: true, message: "campo requerido" })}
                      />
                    </div>
                    <div>
                      <label htmlFor="FECHA_MAX_TERMINO" className="block text-sm font-semibold text-gray-800">
                        Fecha Maxima de termino
                      </label>
                      <input
                        type="date"
                        name="FECHA_MAX_TERMINO"
                        className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        {...register("FECHA_MAX_TERMINO", { required: true, message: "campo requerido" })}
                      />
                    </div>

                  </div>
                </div>

                <div className="mt-6">
                  <button type='submit' 
                  className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                  >
                    Crear tarea
                  </button>
                </div>
              </form>
            </div>
          }
        </div>}
    </div>
  )
}

export default AsignarTarea



