import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
  GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu,
  Filter, Page, Inject, Search, Toolbar
} from '@syncfusion/ej2-react-grids';
import { employeesGrid, employeesData } from '../data/dummy';
import { Header } from '../components';
import { useProject } from '../context/projectContext';


const Usuario = () => {
  const {  participants } = useProject();
  useEffect(() => {
  }, [])
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
    </div>
  )
}

export default Usuario;