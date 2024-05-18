import React, { useState } from 'react';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

const KanbanComponentSyncfusion = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [content, setContent] = useState('Este es el contenido editable.');

  const handleDialogOpen = () => {
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  return (
    <div>
      <ButtonComponent onClick={handleDialogOpen}>Abrir Diálogo</ButtonComponent>

      <DialogComponent
        visible={dialogVisible}
        width='400px'
        header='Header del Diálogo'
        footerTemplate={() => (
          <div>
            <ButtonComponent onClick={handleDialogClose} cssClass='e-primary'>
              Cancelar
            </ButtonComponent>
            <ButtonComponent onClick={handleDialogClose} cssClass='e-primary'>
              Guardar
            </ButtonComponent>
          </div>
        )}
        close={handleDialogClose}
      >
        <div>
          <label htmlFor='dialogContent'>Aquí puedes editar el contenido del diálogo:</label>
          <textarea
            id='dialogContent'
            rows='4'
            style={{ width: '100%' }}
            value={content}
            onChange={handleContentChange}
          />
        </div>
      </DialogComponent>

      <KanbanComponent
        id='kanban'
        keyField='Status'
        dataSource={kanbanData}
        cardSettings={{ contentField: 'Summary', headerField: 'Id' }}
      >
        <ColumnsDirective>
          <ColumnDirective headerText='To Do' keyField='Open' />
          <ColumnDirective headerText='In Progress' keyField='InProgress' />
          <ColumnDirective headerText='Done' keyField='Close' />
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
};

const kanbanData = [
  {
    Id: 'Task 1',
    Status: 'Open',
    Summary: 'Task 1 Summary'
  },
  {
    Id: 'Task 2',
    Status: 'InProgress',
    Summary: 'Task 2 Summary'
  },
  {
    Id: 'Task 3',
    Status: 'Close',
    Summary: 'Task 3 Summary'
  }
];

export default KanbanComponentSyncfusion;


import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import '@syncfusion/ej2-base/styles/material.css';
import { extend, L10n } from '@syncfusion/ej2-base';
import { useProject } from '../context/projectContext';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import styles from '../css/kanban.module.css';

L10n.load({
  'esp': {
    'kanban': {
      'items': 'tareas',
      'save': 'Guardar',
      'cancel': 'Cancelar',
      'delete': 'Eliminar',
      'yes': 'Sí',
      'no': 'No',
      'editTitle': 'Detalles de Tarea',
      'deleteTitle': 'Eliminar Tarea',
      'deleteContent': '¿Seguro que deseas eliminar esta tarea?',
      'noCard': 'Sin tareas por el momento',
      'required': 'El campo es requerido'
    }
  }
});

const Kanban = () => {
  const { tareasKanban, setTareasKanban } = useProject();
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [idtarea, setIDTarea] = useState(0);
  const [nomtarea, setNomTarea] = useState("");
  const [desctarea, setDescTarea] = useState("");
  const [estadotarea, setEstadoTarea] = useState("");
  const [fecha_iniciotarea, setFechaInTarea] = useState("");
  const [fecha_m_tarea, setFechaMTarea] = useState("");

  useEffect(() => {
    // Ocultar el diálogo predeterminado del KanbanComponent
    const hideDefaultDialog = () => {
      const defaultDialog = document.querySelector('.e-kanban-dialog');
      if (defaultDialog) {
        defaultDialog.style.display = 'none';
      }
    };
    

    // Llamar a la función para ocultar el diálogo cuando la página se carga
    hideDefaultDialog();
  }, []);

  useEffect(() => {

  }, [tareasKanban]);

  useEffect(() => {
    if(selectedTarea != null){
      setIDTarea(selectedTarea.ID);
    setNomTarea(selectedTarea.NOMBRE);
    setDescTarea(selectedTarea.DESCRIPCION);
    setEstadoTarea(selectedTarea.ESTADO_DESARROLLO);
    setFechaInTarea(selectedTarea.FECHA_INICIO);
    setFechaMTarea(selectedTarea.FECHA_MAX_TERMINO);
    }
    
  }, [selectedTarea]);

  const handleDialogClose = () => {
    // Lógica para cerrar el diálogo
    setSelectedTarea(null);
  };

  const tooltipTemplate = (data) => (
    <div>
      <p><b>ID:</b> {data.ID}</p>
      <p><b>DESCRIPCION:</b> {data.DESCRIPCION}</p>
      <p><b>Requerimiento:</b> {data.OBJETIVO}</p>
      <p><b>Estado:</b> {data.ESTADO_DESARROLLO}</p>
      <p><b>Entregar antes de:</b> {data.FECHA_MAX_TERMINO}</p>
      <p><b>Desarrollador:</b> {data.Desarrollador}</p>
    </div>
  );

  const DialogOpen = (args) => {
    args.cancel = true;
    
  }
  

  const handleEliminarClick = () => {
    console.log("ELIMINAR...");
  };

  const dialogTemplate = (args) => {

    

    const fecha_inicio = new Date(args.FECHA_INICIO);
    const fecha_mx = new Date(args.FECHA_MAX_TERMINO);
    let di = fecha_inicio.getDate();
    let mi = fecha_inicio.getMonth() + 1;
    if(mi < 10){
       mi = "0"+mi;
    }
    if(di < 10){
      di = "0"+di;
    }
    const yi = fecha_inicio.getFullYear();
    let fecha = yi+"-"+mi+"-"+di;
    
    let df = fecha_mx.getDate();
    let mf = fecha_mx.getMonth() + 1;
    if(mf < 10){
       mf = "0"+mf;
    }
    if(df < 10){
      df = "0"+df;
    }
    const yf = fecha_mx.getFullYear();
    let fechaf = yf+"-"+mf+"-"+df;
    console.log("dialog data"+idtarea+ " " + nomtarea);

    const handleEliminarClickDialog = () => {
      console.log("ELIMINAR...");
    };

    return (
      <div className={styles['kanban-dialog-container']} id='d-container'>
        <div className={styles['kanban-dialog-overlay']}></div>
        <DialogComponent
          id="kanban_dialog"
          header='Detalles de Tarea'
          width='500px'
          target='#kanban'
          showCloseIcon={true}
          close={handleDialogClose}
          closeOnEscape={true}
        >
          <form>
            <input type="text" id="ID" name="ID" className='hidden' defaultValue={args.ID}/>
            <div className="input-group mb-3 flex items-center ">
              <label htmlFor="tarea" className='block text-sm font-semibold text-gray-800'>Tarea: </label>
              <input  className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder=
                "task" aria-label="Username" id="tarea" name='tarea' defaultValue={args.NOMBRE} onChange={(e) => setNomTarea(e.target.value)}/>
            </div>
            <div className="input-group mb-3 flex items-center ">
              <label htmlFor="desc-tarea" className='block text-sm font-semibold text-gray-800'>Descripcion: </label>
              <input type="text" className="block w-full px-4 py-2 mt-2 text-indigo-400 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder=
                "task-desc" aria-label="Username" id="desc-tarea" name='desc-tarea' defaultValue={args.DESCRIPCION} onChange={(e) => setDescTarea(e.target.value)}/>
            </div>
            <div className="input-group mb-3 flex items-center ">
              <label htmlFor="estado" className='block text-sm font-semibold text-gray-800'>Estado: </label>
              <select id="estado" defaultValue={args.ESTADO_DESARROLLO} name='estado'  onChange={(e) => setEstadoTarea(e.target.value)} className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40">
                <option value="" >Selecciona uns opción</option>
                <option value="En espera" >En espera</option>
                <option value="En desarrollo" >En desarrollo</option>
                <option value="Por Revisar" >Por Revisar</option>
                <option value="Cerrada" >Cerrada</option>
              </select>
            </div>
            <div>
              <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                Fecha de inicio
              </label>
              <input
                type="date"
                id="FECHA_INICIO"
                name="FECHA_INICIO"
                className="block w-full px-4 py-2 mt-6 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                defaultValue={fecha}
                onChange={(e) => setFechaInTarea(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="FECHA_INICIO" className="block text-sm font-semibold text-gray-800">
                Fecha Máxima de término
              </label>
              <input
                type="date"
                id="FECHA_TERMINO"
                name="FECHA_TERMINO"
                className="block w-full px-4 py-2 mt-6 text-black bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
                defaultValue={fechaf}
                onChange={(e) => setFechaMTarea(e.target.value)}
              />
            </div>
            <div className="e-footer-content">
              <button type="button" className="e-control e-btn e-lib e-flat e-dialog-delete" onClick={handleEliminarClickDialog}>Eliminar</button>
              <button type="button" className="e-control e-btn e-lib e-flat e-dialog-edit e-primary" >Guardar</button>
              <button type="button" className="e-control e-btn e-lib e-flat e-dialog-cancel" >Cancelar</button>
            </div>
          </form>
        </DialogComponent>
      </div>
    );
  };

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl e-kanbantooltiptemp">
        <Header category="App" title="Kanban" />
        <KanbanComponent
          id="kanban"
          keyField="ESTADO_DESARROLLO"
          dataSource={tareasKanban}
          cardSettings={{ contentField: "DESCRIPCION", headerField: "NOMBRE" }}
          enableTooltip={true}
          tooltipTemplate={tooltipTemplate}
          swimlaneSettings={{ keyField: "Desarrollador" }}
          locale='esp'
          dialogSettings={{template: dialogTemplate}}
          dialogOpen={DialogOpen.bind(this)}
          cardClick={handleEliminarClick}
          cardDoubleClick={(args) => {setSelectedTarea(args.data); console.log(args.data)}}
          
          //cardDoubleClick={(args) => {setSelectedTarea(args.data);console.log(selectedTarea)}}
        >
          <ColumnsDirective>
            <ColumnDirective headerText="Pendiente" keyField="En espera" allowToggle={true} />
            <ColumnDirective headerText="En desarrollo" keyField="En desarrollo" allowToggle={true} />
            <ColumnDirective headerText="Por Revisar" keyField="Por Revisar" allowToggle={true} />
            <ColumnDirective headerText="Cerrada" keyField="Cerrada" />
          </ColumnsDirective>
        </KanbanComponent>
      </div>
    </>
  );
};

export default Kanban;