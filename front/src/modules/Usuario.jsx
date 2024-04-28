import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
  GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu,
  Filter, Page, Inject, Search, Toolbar
} from '@syncfusion/ej2-react-grids';
import { employeesGrid, employeesData } from '../data/dummy';
import { Header } from '../components';
import { useProject } from '../context/projectContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


const Usuario = () => {
  const {
    register,
    handleSubmit,
    formState:{errors},
  } = useForm({
    resolver: zodResolver()
  });
  const {projecterrors, fechasproject, addParticipant,participants} = useProject();

  const onSubmit = handleSubmit(async (values)=>{
    const data = {
      CORREO: values.CORREO,
      ID_PROYECTO: fechasproject[0].ID
    }
    addParticipant(data);
  })



  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'><Header category="Page" title="Usuarios" />

      {participants &&
        <div>
          {participants.map((participant) => (
            <div>
              <p>Nombre de usuario: {participant.NOMBRE_USUARIO}</p>
              <p>ID: {participant.ID_USUARIO}</p>
              <p>Fecha: {participant.FECHA_UNION}</p>
              <p>Numero boleta: {participant.NUMERO_BOLETA}</p>
            </div>
          ))}
        </div>
      }
      <GridComponent dataSource={employeesData} allowPaging allowSorting toolbar={['Search']} width="auto">
        <ColumnsDirective>
          {employeesGrid.map((item, index) => (
            <ColumnDirective key={index}{...item} />))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Toolbar]} />
      </GridComponent>

      <div className="card-body row justify-content-evenly">
        <div className="col">
          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-2 px-2 row justify-content-evenly">
              <input
                className="shadow-sm bg-gray-50 border border-l-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                type="text"
                name="CORREO"
                placeholder="Correo del participante"
                {...register("CORRREO", { required: true, message: "campo requerido" })}
              />
              <div className="col">
                <input className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-0" type="submit" value="Unirse a proyecto" />
              </div>
            </div>
          </form>
          {errors.CORREO && <div class="flex items-center  p-1 mb-1  text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-600 " role="alert">{errors.CORREO.message}</div>}
        </div>

      </div>
    </div>
  )
}

export default Usuario;