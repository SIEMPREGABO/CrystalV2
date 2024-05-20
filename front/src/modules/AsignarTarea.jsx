import React, { useEffect } from 'react'
import { useProject } from '../context/projectContext';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema } from '../schemas/project';
import { useAuth } from '../context/authContext';

function AsignarTarea() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema)
  });

  const {user} = useAuth();
  // la funcion creatTask
  //Agregar a la tarea la tarea dependiente y el requerimiento que cumple y rol, a quien se asigna
  const { fechasproject, message, setProjecterrors, setMessage, iteracionactual, createTask, participants, requerimientos, projecterrors, tareas } = useProject();
  const onSubmit = handleSubmit(async (values) => {
    console.log("submit iniciado");
    const data = {
      NOMBRE: values.NOMBRE,
      DESCRIPCION: values.DESCRIPCION,
      FECHA_INICIO: values.FECHA_INICIO,
      FECHA_MAX_TERMINO: values.FECHA_MAX_TERMINO,
      HORAINICIO: values.HORAINICIO,
      HORAMAXIMA: values.HORAMAXIMA,
      ID_REQUERIMIENTO: values.ID_REQUERIMIENTO,
      ROLPARTICIPANTE: values.ROLPARTICIPANTE,
      ID_USUARIO: values.ID_USUARIO,
      ID_TAREA_DEPENDIENTE: values.ID_TAREA_DEPENDIENTE,
      iteracionactual: iteracionactual,
      CORREO: user.CORREO
    }
    createTask(data);
  });

  useEffect(() => {
    setProjecterrors([]);
    setMessage([]);
    //console.log(fechasproject);
  }, [])



  return (

    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">

      {fechasproject[0].ESTADO === "En espera" &&
        <div>
          {iteracionactual === "" &&
            <div className="w-full p-6 m-auto bg-white rounded-md  ring-indigo-600 lg:max-w-xl">
              No puedes asignar tareas aun
            </div>}
        </div>}

      {fechasproject[0].ESTADO === "En desarrollo" &&
        <div>
          {message && <div class=" items-center bg-green-100 border-l-4 border-green-500 text-green-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
            <p class="text-lg font-semibold m-2">{message}</p>
          </div>
          }
          {projecterrors && <div class=" items-center bg-red-100 border-l-4 border-red-500 text-red-700  rounded-lg m-2 shadow-md" style={{ maxWidth: '600px' }}>
            <p class="text-lg font-semibold m-2">{projecterrors}</p>
          </div>
          }
          {iteracionactual !== "" &&

            <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl ring-indigo-600 lg:max-w-xl">
              <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase">
                Asigna una tarea
              </h1>
              <form className="mt-6" onSubmit={handleSubmit(onSubmit)} >
                {/* Nombre de la tarea */}
                <div className="mb-2">
                  <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800">
                    Nombre de la tarea <span className='text-sm font-semibold text-red-800'>*</span>
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
                    Descripción <span className='text-sm font-semibold text-red-800'>*</span>
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
                  <div className="flex flex-col md:flex-row justify-around items-center gap-4">
                    <div>
                      <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                        Fecha de inicio <span className='text-sm font-semibold text-red-800'>*</span>
                      </label>
                      <input
                        type="date"
                        id="FECHA_INICIO"
                        name="FECHA_INICIO"
                        className="block w-full px-4 py-2 mt-6 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        {...register("FECHA_INICIO", { required: true, message: "campo requerido" })}
                      />

                    </div>

                    <div>
                      <label htmlFor="FECHA_MAX_TERMINO" className="block text-sm font-semibold text-gray-800">
                        Fecha Maxima de Entrega <span className='text-sm font-semibold text-red-800'>*</span>
                      </label>
                      <input
                        type="date"
                        id="FECHA_MAX_TERMINO"
                        name="FECHA_MAX_TERMINO"
                        className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        {...register("FECHA_MAX_TERMINO", { required: true, message: "campo requerido" })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex flex-col md:flex-row justify-around items-center gap-4">
                    <div>

                      <label htmlFor="HORAINICIO" className="block text-sm font-semibold text-gray-800">
                        Hora de inicio <span className='text-sm font-semibold text-red-800'>*</span>
                      </label>
                      <input
                        type="time"
                        id="HORAINICIO"
                        name="HORAINICIO"
                        required
                        className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        {...register("HORAINICIO", { required: true, message: "campo requerido" })}

                      />

                    </div>

                    <div>

                      <label htmlFor="HORAMAXIMA" className="block text-sm font-semibold text-gray-800">
                        Hora máxima de Entrega <span className='text-sm font-semibold text-red-800'>*</span>
                      </label>
                      <input
                        type="time"
                        id="HORAMAXIMA"
                        name="HORAMAXIMA"
                        required
                        className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        {...register("HORAMAXIMA", { required: true, message: "campo requerido" })}
                      />
                    </div>

                  </div>
                </div>
                {/* Requerimiento Cumplido */}
                <div className="mb-2">
                  <label htmlFor="ID_REQUERIMIENTO" className="block text-sm font-semibold text-gray-800">
                    Requerimiento Cumplido <span className='text-sm font-semibold text-red-800'>*</span>
                  </label>
                  <select
                    id="ID_REQUERIMIENTO"
                    name="ID_REQUERIMIENTO"
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    {...register("ID_REQUERIMIENTO", { required: true, message: "campo requerido" })}
                  >
                    <option value="">Selecciona requerimiento</option>
                    {requerimientos.map((requerimiento) => (
                      <option key={requerimiento.ID} value={requerimiento.ID}>
                        {requerimiento.OBJETIVO}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tarea Dependiente */}
                <div className="mb-2">
                  <label htmlFor="ID_TAREA_DEPENDIENTE " className="block text-sm font-semibold text-gray-800">
                    Esta tarea depende de otra? (seleccione la tarea)
                  </label>
                  <select
                    id="ID_TAREA_DEPENDIENTE "
                    name="ID_TAREA_DEPENDIENTE "
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    {...register("ID_TAREA_DEPENDIENTE", { required: true, message: "campo requerido" })}
                  >
                    <option value="">Selecciona una tarea dependiente</option>
                    {tareas.map((tarea) => (
                      <option value={tarea.ID}>{tarea.NOMBRE}</option>
                    ))}
                  </select>
                </div>

                {/* Rol del Participante */}
                <div className="mb-2">
                  <label htmlFor="ROLPARTICIPANTE" className="block text-sm font-semibold text-gray-800">
                    Rol del Participante
                  </label>
                  <select
                    id="ROLPARTICIPANTE"
                    name="ROLPARTICIPANTE"
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    {...register("ROLPARTICIPANTE", { required: true, message: "campo requerido" })}
                  >
                    <option value="">Selecciona un rol</option>
                    <option value="Diseñador Principal">Diseñador Principal</option>
                    <option value="Diseñador">Diseñador</option>
                    <option value="Embajador">Embajador</option>
                  </select>
                </div>

                {/* Participante Asignado */}
                <div className="mb-2">
                  <label htmlFor="ID_USUARIO" className="block text-sm font-semibold text-gray-800">
                    Participante Asignado
                  </label>
                  <select
                    id="ID_USUARIO"
                    name="ID_USUARIO"
                    className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    {...register("ID_USUARIO", { required: true, message: "campo requerido" })}
                  >
                    <option value="">Asigna un participante</option>
                    {participants.map((participant) => (
                      <option key={participant.ID_USUARIO} value={participant.ID_USUARIO}>
                        {participant.NOMBRE_USUARIO}
                      </option>
                    ))}
                    {/* Aquí irían las opciones dinámicas */}
                  </select>
                </div>

                {/* Botón de envío */}
                <div className="mt-6">
                  <button type='submit'
                    className="w-full px-4 py-2 tracking-wide 
                    text-white transition-colors duration-200 
                    transform bg-indigo-700 rounded-md hover:bg-indigo-600 
                    focus:outline-none focus:bg-indigo-600"
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