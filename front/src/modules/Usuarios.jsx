import React from 'react'
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu,
Filter, Page,Inject, Search, Toolbar} from '@syncfusion/ej2-react-grids';
import { employeesGrid,employeesData } from '../data/dummy';
import { Header } from '../components';


const Usuario = () => {

  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'><Header category="Page" title="Participantes"/>

    <GridComponent  dataSource={employeesData} allowPaging allowSorting toolbar={['Search']} width="auto">
      <ColumnsDirective>
        {employeesGrid.map((item,index) =>(
        <ColumnDirective key={index}{...item} />))}
      </ColumnsDirective>
      <Inject services={[Page, Search, Toolbar]}/>
    </GridComponent>
    </div>
  )

  // const { id } = useParams();
  // const { getParticipants, participants } = useProject();
  // useEffect(() => {
  //   const data = {
  //     ID_PROYECTO: id
  //   }
  //   getParticipants(data);
  // }, [])


  // return (
  //   <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'><Header category="Page" title="Usuarios" />

  //     {participants &&
  //       <div>
  //         {participants.map((participant) => (
  //           <div>
  //             <p>Nombre de usuario: {participant.NOMBRE_USUARIO}</p>
  //             <p>ID: {participant.ID_USUARIO}</p>
  //             <p>Fecha: {participant.FECHA_UNION}</p>
  //             <p>Numero boleta: {participant.NUMERO_BOLETA}</p>
  //           </div>
  //         ))}
  //       </div>
  //     }
  //     <GridComponent dataSource={employeesData} allowPaging allowSorting toolbar={['Search']} width="auto">
  //       <ColumnsDirective>
  //         {employeesGrid.map((item, index) => (
  //           <ColumnDirective key={index}{...item} />))}
  //       </ColumnsDirective>
  //       <Inject services={[Page, Search, Toolbar]} />
  //     </GridComponent>
  //   </div>
  // )
}

export default Usuario;