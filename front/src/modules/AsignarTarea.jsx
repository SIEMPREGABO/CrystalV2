import React from 'react';

function AsignarTarea() {
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl ring-indigo-600 lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase">
          Asigna una tarea
        </h1>
        <form className="mt-6">
          {/* Nombre de la tarea */}
          <div className="mb-2">
            <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800">
              Nombre de la tarea
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              placeholder='Escribe el nombre ...'
              required
              className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          {/* Descripción */}
          <div className="mb-2">
            <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-800">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder='Escribe tu descripción ...'
              required
              className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
              rows="4"
            ></textarea>
          </div>

          {/* Fechas */}
          <div className="mb-2">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <div>
                <label htmlFor="inicioFecha" className="block text-sm font-semibold text-gray-800">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  id="inicioFecha"
                  name="inicioFecha"
                  required
                  className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div>
                <label htmlFor="finalFecha" className="block text-sm font-semibold text-gray-800">
                  Fecha de finalización
                </label>
                <input
                  type="date"
                  id="finalFecha"
                  name="finalFecha"
                  required
                  className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div>
                <label htmlFor="finalFecha" className="block text-sm font-semibold text-gray-800">
                  Fecha Maxima de Entrega
                </label>
                <input
                  type="date"
                  id="finalFecha"
                  name="finalFecha"
                  required
                  className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              
            </div>
          </div>

          <div className="mb-2">
                <label htmlFor="horaEntrega" className="block text-sm font-semibold text-gray-800">
                  Hora de entrega
                </label>
                <input
                  type="time"
                  id="horaEntrega"
                  name="horaEntrega"
                  required
                  className="block w-full px-2 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

          {/* Tarea Dependiente */}
          <div className="mb-2">
            <label htmlFor="tareaDependiente" className="block text-sm font-semibold text-gray-800">
              Tarea Dependiente
            </label>
            <select
              id="tareaDependiente"
              name="tareaDependiente"
              className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
            >
              <option value="">Selecciona una tarea dependiente</option>

            </select>
          </div>

          {/* Requerimiento Cumplido */}
          <div className="mb-2">
            <label htmlFor="requerimiento" className="block text-sm font-semibold text-gray-800">
              Requerimiento Cumplido
            </label>
            <input
              type="text"
              id="requerimiento"
              name="requerimiento"
              placeholder='Describe el requerimiento cumplido ...'
              required
              className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>


          <div className="mb-2">
            <label htmlFor="rolParticipante" className="block text-sm font-semibold text-gray-800">
              Rol del Participante
            </label>
            <select
              id="rolParticipante"
              name="rolParticipante"
              className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
            >
              <option value="">Selecciona un rol</option>
            </select>
          </div>

          {/* Participante Asignado */}
          <div className="mb-2">
            <label htmlFor="participanteAsignado" className="block text-sm font-semibold text-gray-800">
              Participante Asignado
            </label>
            <select
              id="participanteAsignado"
              name="participanteAsignado"
              className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
            >
              <option value="">Asigna un participante</option>

            </select>
          </div>

          <div className="mt-6">
            <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AsignarTarea;

