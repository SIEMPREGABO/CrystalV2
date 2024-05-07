import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { requestVerify } from "../requests/auth.js";
import { requestCreate, requestJoin, requestProjects, requestPermissions, requestgetProject, 
  requestAddRequirement, requestCreateTask, requestAdd,requestDelete, 
  requestAddMessage, requestMessages } from "../requests/projectReq.js";
import Cookies from "js-cookie";
import { useAuth } from "./authContext.js";

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const ProjectProvider = ({ children }) => {
  const {setUser, setIsAuthenticated ,setLoading} = useAuth();

  const [IsParticipant, setIsParticipant] = useState(true);
  const [userRole, setUserRole] = useState(false);

  const [message, setMessage] = useState([]);
  const [projecterrors, setProjecterrors] = useState([]);

  const [IsCreated, setIsCreated] = useState(false);
  const [IsJoined, setIsJoined] = useState(false);

  const [projects, setProjects] = useState([]);

  const [participants, setParticipants] = useState([]);
  const [fechasproject, setFechasproject] = useState([]);
  const [fechasentregas, setFechasentregas] = useState([]);
  const [fechasiteraciones, setFechasiteraciones] = useState([]);
  const [tareas, setTareas] = useState([]);

  const [entregaactual, setEntregaactual] = useState([]);
  const [iteracionesRestantes, setIteracionesRestantes] = useState([]);
  const [requerimientos, setRequerimientos] = useState([]);
  const [messagesChat, setMessagesChat] = useState([]);
  const [chaterrors, setChatErrors] = useState([]);


  useEffect(() => {
    if (message.length > 0) {
      const timer = setTimeout(() => {
        setMessage([]);
        setIsCreated(true);
        setIsJoined(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (projecterrors.length > 0) {
      const timer = setTimeout(() => {
        setProjecterrors([]);
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

  }, [IsJoined, IsCreated, projecterrors, message]);

  const createTask = async (Task) => {
    try {
      const res = await requestCreateTask(Task);
      console.log(res.data.message);
    } catch (error) {
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
      setMessage(res.data.message);
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

  const joinProject = async (joinable) => {
    try {
      const res = await requestJoin(joinable);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const addParticipant = async (participant) => {
    try {
      const res = await requestAdd(participant);
      setMessage(res.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const createRequirements = async (project) => {
    try {
      const res = await requestAddRequirement(project);
      setMessage(res.data.message);
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
      console.log(res.data.participants);
      setFechasproject(res.data.fechasProyecto);
      setFechasentregas(res.data.fechasEntregas);
      setFechasiteraciones(res.data.fechasIteraciones);
      setEntregaactual(res.data.entregaActual);
      setIteracionesRestantes(res.data.iteracionesRestantes);
      setRequerimientos(res.data.requerimientos);
      setTareas(res.data.tasks)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  }

  const deleteParticipant = async (id) => {
    try {
      const res = await requestDelete(id);
      setMessage(res.data.message);
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

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await requestVerify(cookies.token);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        
        IsJoined,
        IsCreated,
        
        message,projecterrors,
        
        participants,
        
        fechasproject,
        fechasentregas,
        fechasiteraciones,
        
        entregaactual,
        iteracionesRestantes,
        
        userRole,
        IsParticipant,
        
        requerimientos,tareas,
        
        chaterrors,
        messagesChat,


        setProjecterrors,
        setIsParticipant,
        setMessage,

        create,
        deleteParticipant,
        getProjects,
        joinProject,
        getProject,
        getPermissions,
        createRequirements,
        createTask,
        addParticipant,
        createMessages,
        getMessages
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;