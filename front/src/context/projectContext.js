import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { requestCreate, requestJoin, requestProjects, requestPermissions, requestgetProject, 
  requestAddRequirement, requestCreateTask, requestAdd, requestAddMessage, requestMessages, requestTasksProject, requestDeleteTask, requestUpdateTask, requestUpdateTState } from "../requests/projectReq.js";
import Cookies from "js-cookie";
import swal from 'sweetalert';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const ProjectProvider = ({ children }) => {

  const [IsParticipant, setIsParticipant] = useState(true);
  const [userRole, setUserRole] = useState(false);

  const [message, setMessage] = useState([]);
  const [projecterrors, setProjecterrors] = useState([]);

  const [IsCreated, setIsCreated] = useState(false);
  const [IsJoined, setIsJoined] = useState(false);

  const [projects, setProjects] = useState([]);
  const [joinerrors, setJoinerrors] = useState([]);

  const [participants, setParticipants] = useState([]);
  const [fechasproject, setFechasproject] = useState([]);
  const [fechasentregas, setFechasentregas] = useState([]);
  const [fechasiteraciones, setFechasiteraciones] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [tareasKanban, setTareasKanban] = useState([]);
  const [entregaactual, setEntregaactual] = useState([]);
  const [iteracionactual, setIteracionactual] = useState([]);
  const [requerimientos, setRequerimientos] = useState([]);
  const [messagesChat, setMessagesChat] = useState([]);
  const [chaterrors, setChatErrors] = useState([]);
  const [entregasproject,  setEntregasProject] = useState([]);
  const [projectInfo, setProjectInfo] = useState([]);
  useEffect(() => {
    if (message.length > 0) {
      const timer = setTimeout(() => {
        setMessage([]);
        setIsCreated(true);
        setIsJoined(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (projecterrors.length > 0 || joinerrors.length > 0) {
      const timer = setTimeout(() => {
        setProjecterrors([]);
        setJoinerrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (IsCreated) {
      const timer = setTimeout(() => {
        setIsCreated(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (IsJoined) {
      const timer = setTimeout(() => {
        setIsJoined(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

  }, [IsCreated, projecterrors, message, joinerrors, IsJoined]);

  const createTask = async (Task) => {
    try {
      console.log(Task);
      const res = await requestCreateTask(Task);
      swal({
        title: 'Asignacion de tarea',
        text: res.data.message,
        icon: (res.status === 200 ? 'success' : (res.status === 400 ? 'warning' : 'error')),
        button: 'Aceptar',
      });
      console.log(res);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const deleteTask = async (Task) => {
    try{
      console.log(Task);
      const res = await requestDeleteTask(Task);
      console.log(res.data.message);
    }catch(error){
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const updateTaskState = async (Task) => {
    try {
      const res = await requestUpdateTState(Task);
      console.log(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const updateTask = async (Task) => {
    try{
      const res = await requestUpdateTask(Task);
      console.log(res.data.message);
    }catch(error){
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const create = async (project) => {
    try {
      const res = await requestCreate(project);
      console.log(res.data);
      setMessage("Proyecto creado con exito");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  };

  const getProjects = async () => {
    try {
      const res = await requestProjects();
      setProjects(res.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  };

  const createMessages = async (message) => {
    try{
      const res = await requestAddMessage(message);
      console.log(res.data); 
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setProjecterrors(error.response.data.message);
      }else{
        setProjecterrors("Error del servidor");
      }
    }
  };

  const getMessages = async (iteracion) => {
    try {
      //const cookies = Cookies.get();
      console.log('iteracion pcontext: ' + iteracion.ID_ITERACION);
      const res = await requestMessages(iteracion);
      console.log('pcontext: ' + res);
      setMessagesChat(res.data);
      //setIsCreated(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  };

  const getTasksProject = async (project) => {
    try{
      const res = await requestTasksProject(project);
      setEntregasProject(res.data);
    }catch(error){
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }
  const joinProject = async (joinable) => {
    try {
      const res = await requestJoin(joinable);
      console.log(res.data);
      setMessage("Usuario registrado en el proyecto");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setJoinerrors(error.response.data.message);
      } else {
        setJoinerrors("Error del servidor");
      }
    }
  }

  const addParticipant = async (participant) => {
    try {
      const res = await requestAdd(participant);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setJoinerrors(error.response.data.message);
      } else {
        setJoinerrors("Error del servidor");
      }
    }
  }

  const createRequirements = async (project) => {
    try {
      const res = await requestAddRequirement(project);
      console.log(res.data);
      swal({
        title: 'Requerimiento Agregado',
        text: res.data.message,
        icon: (res.data.status === "OK" ? 'success' : 'error'),
        button: 'Aceptar',
      });
      setMessage("Requerimiento creado con éxito");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const getProject = async (project) => {
    try {
      const res = await requestgetProject(project);
      setParticipants(res.data.participants);
      setFechasproject(res.data.fechasProyecto);
      setFechasentregas(res.data.fechasEntregas);
      setFechasiteraciones(res.data.fechasIteraciones);
      setEntregaactual(res.data.entregaActual);
      setIteracionactual(res.data.iteracionActual);
      setRequerimientos(res.data.requerimientos);
      setTareas(res.data.tasks)
      setTareasKanban(res.data.tasksKanban)
      setProjectInfo(res.data.projectInfo);
      //console.log(tareas);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const getPermissions = async (id) => {
    try {
      const nombreCookie = `Proyecto${id.ID}`;
      const Cookie = Cookies.get(nombreCookie);
      if (!Cookie) {
        setIsParticipant(false);
        return;
      }
      const Permission = await requestPermissions(id);
      if (!Permission.data) setIsParticipant(false);
      else {
        setIsParticipant(true);
        if (Permission.data.role === "admin") {
          setUserRole(true);
        }
        await getProject(id);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsParticipant(false);
      } else {
        setIsParticipant(false);
        if (error.response && error.response.data && error.response.data.message) {
          setProjecterrors(error.response.data.message);
        } else {
          setProjecterrors("Error del servidor");
        }
      }
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        projecterrors,
        IsCreated,
        message,
        joinerrors,
        participants,
        fechasproject,
        fechasentregas,
        fechasiteraciones,
        entregaactual,
        iteracionactual,
        userRole,
        IsParticipant,requerimientos,tareas,
        chaterrors,
        messagesChat,
        entregasproject,
        tareasKanban,
        projectInfo,
        setIsParticipant,
        create,
        getProjects,
        joinProject,
        getProject,
        getPermissions,
        createRequirements,
        createTask,
        addParticipant,
        createMessages,
        getMessages,
        getTasksProject,
        deleteTask,
        updateTask,
        setTareasKanban,
        updateTaskState
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;