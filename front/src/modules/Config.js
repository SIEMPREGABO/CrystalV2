import React from "react";



export const Config = () => {

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl ring-indigo-600 lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase ">
                    Ajustes del proyecto
                </h1>
                <form className="mt-6">
                    <div className="mb-2 items-center">
                        <div className="flex flex-col-reverse">
                            <div className='flex-row mr-3 ml-3 mt-2'>
                                <label htmlFor="finalFecha" className="block text-sm font-semibold text-gray-800">
                                    Fecha de termino
                                </label>
                                <input
                                    type="date"
                                    id="finalFecha"
                                    name="finalFecha"
                                    placeholder='finalFecha'
                                    required
                                    className="block w-full px-6 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                />
                            </div>

                            <div className="flex-row  mr-3 ml-3">
                                <label htmlFor="inicioFecha" className="block text-sm font-semibold text-gray-800">
                                    Fecha de inicio
                                </label>
                                <input
                                    type="date"
                                    id="inicioFecha"
                                    name="inicioFecha"
                                    placeholder='inicioFecha'
                                    required
                                    className="block w-full px-6 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-2 items-center">
                        <div className="flex flex-col-reverse ">
                            <div className="flex-row mr-3 ml-3 mt-2">
                                <label htmlFor="constitucion" className="block text-sm font-semibold text-gray-800">
                                    Dias para la constitucion del proyecto
                                </label>
                                <select
                                    type="constitucion"
                                    id="constitucion"
                                    name="constitucion"
                                    required
                                    className="block w-full px-6 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                >
                                    <option value="">Selecciona</option>
                                    <option value="1">3</option>
                                    <option value="2">4</option>
                                    <option value="3">5</option>

                                </select>
                            </div>

                            <div className="flex-row mr-3 ml-3">
                                <label htmlFor="entregas" className="block text-sm font-semibold text-gray-800">
                                    Número de Entregas
                                </label>
                                <select
                                    type="number"
                                    id="entregas"
                                    name="entregas"
                                    required
                                    className="block w-full px-6 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                >
                                    <option value="">Selecciona</option>
                                    <option value="1">3</option>
                                    <option value="2">4</option>
                                    <option value="3">5</option>

                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex-row mr-3 ml-3">
                        <label htmlFor="iteraciones" className="block text-sm font-semibold text-gray-800">
                            Iteraciones por entrega
                        </label>
                        <select
                            type="iteraciones"
                            id="iteraciones"
                            name="iteraciones"
                            required
                            className="block w-full px-6 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        >
                            <option value="">Selecciona</option>
                            <option value="1">3</option>
                            <option value="2">4</option>
                            <option value="3">5</option>

                        </select>
                    </div>

                    <div className="flex-row mr-3 ml-3 mt-2">
                        <label htmlFor="entregas" className="block text-sm font-semibold text-gray-800">
                            Delegar puesto a participante:
                        </label>
                        <select
                            type="number"
                            id="delegarPuesto"
                            name="delegarPuesto"
                            required
                            className="block w-full px-6 py-2 mt-2 text-black-600 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        >
                            <option value="">Selecciona</option>
                            <option value="1">3</option>
                            <option value="2">4</option>
                            <option value="3">5</option>

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

export default Config;