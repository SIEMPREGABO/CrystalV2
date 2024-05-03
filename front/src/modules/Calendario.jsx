import React, { useEffect, useState } from 'react'
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
//import { scheduleData } from '../data/dummy';
import { Header } from '../components';
import { useProject } from '../context/projectContext';
import { useParams } from 'react-router-dom';

const Calendario = () => {
  const {
    fechasproject,
    fechasentregas,
    fechasiteraciones
  } = useProject();
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    let events = [];
    fechasproject?.forEach(project => {
      events.push({
        Subject: `Inicio del Proyecto: ${project.NOMBRE}`,  
        StartTime: new Date(project.FECHA_INICIO),
        EndTime: new Date(project.FECHA_TERMINO),
        IsAllDay: true
      });
    });


    fechasentregas?.forEach((entrega, index) => {
      events.push({
        Subject: `Entrega ${index + 1}`,
        StartTime: new Date(entrega.FECHA_INICIO),
        EndTime: new Date(entrega.FECHA_TERMINO),
        IsAllDay: true
      });
    });


    fechasiteraciones?.forEach((iteracionesPorEntrega, index) => {
      iteracionesPorEntrega.forEach((iteracion, subIndex) => {
        events.push({
          Subject: `Iteración ${subIndex + 1} de Entrega ${index + 1}`,
          StartTime: new Date(iteracion.FECHA_INICIO),
          EndTime: new Date(iteracion.FECHA_TERMINO),
          IsAllDay: true
        });
      });
    });

    setScheduleData(events);
  }, [fechasproject, fechasentregas, fechasiteraciones]);




  return (
    <div className='m-2 md:m-10 mt-24  p-2 md:p-10 bg-white rounded-3xl'>
      <Header title="Calendario" />

      <ScheduleComponent height="650px" eventSettings={{ dataSource: scheduleData }}>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
    </div>
  )
}

export default Calendario;

