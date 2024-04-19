import React from 'react';
import { Header } from '../components'; // Asegúrate de que este import sea correcto
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import '@syncfusion/ej2-base/styles/material.css'; // Asegúrate de importar los estilos necesarios

const Kanban = () => {
  let data = [
    { Id: 1, Status: 'Open', Summary: 'Analyze the new requirements gathered from the customer.', Type: 'Story', Priority: 'Low', Tags: 'Analyze,Customer', Estimate: 3.5, Assignee: 'Nancy Davloio', RankId: 1 },
    { Id: 2, Status: 'InProgress', Summary: 'Fix the issues reported in the IE browser.', Type: 'Bug', Priority: 'Release Breaker', Tags: 'IE', Estimate: 2.5, Assignee: 'Janet Leverling', RankId: 2  },
    { Id: 3, Status: 'Testing', Summary: 'Fix the issues reported by the customer.', Type: 'Bug', Priority: 'Low', Tags: 'Customer', Estimate: '3.5', Assignee: 'Steven walker', RankId: 1 },
    { Id: 4, Status: 'Close', Summary: 'Arrange a web meeting with the customer to get the login page requirements.', Type: 'Others', Priority: 'Low', Tags: 'Meeting', Estimate: 2, Assignee: 'Michael Suyama', RankId: 1 },
    { Id: 5, Status: 'Done', Summary: 'Validate new requirements', Type: 'Improvement', Priority: 'Low', Tags: 'Validation', Estimate: 1.5, Assignee: 'Robert King', RankId: 1 },
    { Id: 6, Status: 'Done', Summary: 'Validate new requirements', Type: 'Improvement', Priority: 'Low', Tags: 'Validation', Estimate: 1.5, Assignee: 'Robert King', RankId: 1 },
    { Id: 7, Status: 'InProgress  ', Summary: 'Validate new requirements', Type: 'Improvement', Priority: 'Low', Tags: 'Validation', Estimate: 1.5, Assignee: 'Robert King', RankId: 1 },
    { Id: 8, Status: 'To Do', Summary: 'Validate new requirements', Type: 'Improvement', Priority: 'Low', Tags: 'Validation', Estimate: 1.5, Assignee: 'Robert King', RankId: 1 },
    { Id: 9, Status: 'Testing', Summary: 'Validate new requirements', Type: 'Improvement', Priority: 'Low', Tags: 'Validation', Estimate: 1.5, Assignee: 'Robert King', RankId: 1 },

  ];

  const headerTemplate = (props) => {
    return (
      <div>
        <div>{props.keyField}</div>
        <div>{props.headerText}</div>
        {/* Agrega aquí cualquier otro contenido deseado para el encabezado */}
      </div>
    );
  };

  const columnTemplate = (props) => {
    return (
      <div >
        <div className="">{props.keyField}</div>
        <div className="">{props.headerText}</div>
        {/* Agrega aquí cualquier otro contenido deseado para la columna */}
      </div>
    );
  };

  // Definición de la plantilla de tooltip
  const tooltipTemplate = (data) => (
    <div>
      <p><b>ID:</b> {data.Id}</p>
      <p><b>Summary:</b> {data.Summary}</p>
      <p><b>Type:</b> {data.Type}</p>
      <p><b>Priority:</b> {data.Priority}</p>
      <p><b>Tags:</b> {data.Tags}</p>
      <p><b>Estimate:</b> {data.Estimate} days</p>
      <p><b>Assignee:</b> {data.Assignee}</p>
    </div>
  );

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl e-kanbantooltiptemp">
      <Header category="App" title="Kanban"/>
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={data}
        cardSettings={{ contentField: "Summary", headerField: "Id" }}
        enableTooltip={true}
        tooltipTemplate={tooltipTemplate} 
      >
        <ColumnsDirective>
          <ColumnDirective headerText="To Do" keyField="Open" headerTemplate={headerTemplate} />
          <ColumnDirective headerText="In Progress" keyField="InProgress" headerTemplate={headerTemplate} />
          <ColumnDirective headerText="Testing" keyField="Testing" headerTemplate={headerTemplate} />
          <ColumnDirective headerText="Done" keyField="Close"/>
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
};

export default Kanban;
