import React,{ useEffect, useState } from "react";
import { ScheduleComponent, Inject, Day, Week, WorkWeek, Month, Agenda } from '@syncfusion/ej2-react-schedule';
import { useProject } from '../context/projectContext';
import { Header } from '../components';

export const Config = () => {
    const {
        fechasproject,
        fechasentregas,
        fechasiteraciones
      } = useProject();
      const [scheduleData, setScheduleData] = useState([]);
    const [changedEvents, setChangedEvents] = useState([]); 
    // Estado para almacenar eventos modificados

    // Función para manejar el cambio de eventos en el calendario
    const handleEventChange = (args) => {
        // Almacena los eventos modificados en el estado
        setChangedEvents(args.changedRecords);
        console.log(args.changedRecords)
    };

    // Función para enviar los cambios al contexto del proyecto
    const handleSaveChanges = () => {
        // Actualiza los datos del calendario en el contexto del proyecto
        console.log(changedEvents);
        //setScheduleData(changedEvents);
        // Limpia los eventos modificados después de enviarlos
        setChangedEvents([]);
    };

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
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl ring-indigo-600 lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-indigo-700 underline uppercase">
                    Ajustes del proyecto
                </h1>

                <Header title=" " />

                <ScheduleComponent
                    height={"600px"}
                    width={"100%"}
                    readonly={false}
                    eventSettings={{ dataSource: scheduleData }}
                    actionComplete={handleEventChange} // Llama a la función handleEventChange cuando se completan las acciones en el calendario
                >
                    <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
                </ScheduleComponent>

                {/* Botón para guardar los cambios */}
                <div className="mt-6">
                    <button onClick={handleSaveChanges} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Config;
