import React, { useEffect } from 'react'
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { scheduleData } from '../data/dummy';
import { Header } from '../components';
import { useProject } from '../context/projectContext';
import { useParams } from 'react-router-dom';

const Calendario = () => {
  const {
    fechasproject,
    fechasentregas,
    fechasiteraciones
  } = useProject();

  useEffect(() => {

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

      {fechasentregas && (
        <div>
          {fechasentregas.map((entrega, index) => (
            <div key={index}>
              <p>Número de entrega: {index + 1}</p>
              <p>Fecha entrega inicio: {entrega.FECHA_INICIO}</p>
              <p>Fecha entrega fin: {entrega.FECHA_TERMINO}</p>
            </div>
          ))}
        </div>
      )}

      {fechasiteraciones && (
        <div>
          {fechasiteraciones.map((iteracionporentrega, index) => (
            <div key={index}>
              {iteracionporentrega.map((iteracion, subIndex) => (
                <div key={subIndex}>
                  <p>Número de iteración: {subIndex + 1}</p>
                  <p>Fecha de inicio: {iteracion.FECHA_INICIO}</p>
                  <p>Fecha de fin: {iteracion.FECHA_TERMINO}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <Header title="Calendario" />

      <ScheduleComponent height="650px" eventSettings={{ dataSource: scheduleData }}>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
    </div>
  )
}

export default Calendario;

