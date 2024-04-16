import React, { useEffect } from 'react'
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { scheduleData } from '../data/dummy';
import { Header } from '../components';
import { useProject } from '../context/projectContext';
import { useParams } from 'react-router-dom';

const Calendario = () => {
  const { id } = useParams();
  const {
    fechasproject,
    fechasEntregas,
    fechasIteraciones,
    getFechasEntregas,
    getFechasIteraciones,
    getFechasProyecto
  } = useProject();

  useEffect(() => {
    const data = {
      ID_PROYECTO: id
    }
    getFechasProyecto(data);
    getFechasEntregas(data);
    //getFechasIteraciones();
  }, []);



  return (
    <div className='m-2 md:m-10 mt-24  p-2 md:p-10 bg-white rounded-3xl'>

      {fechasproject && (
        <div>
          {fechasproject.map((fechaProject) => (
            <div>
              <p>Fecha Proyecto inicio: {fechaProject.FECHA_INICIO}</p>
              <p>Fecha Proyecto final: {fechaProject.FECHA_TERMINO}</p>
            </div>
          ))}
        </div>
      )}
      {/*<div>
        <p>Fecha Proyecto inicio: {fechasproject.FECHA_INICIO}</p>
        <p>Fecha Proyecto final: {fechasproject.FECHA_TERMINO}</p>

    </div>*/}
      <Header title="Calendario" />

      <ScheduleComponent height="650px" eventSettings={{ dataSource: scheduleData }}>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
    </div>
  )
}

export default Calendario;

