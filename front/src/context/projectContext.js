import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { requestCreate, requestJoin, requestProjects, requestPermissions, requestgetProject } from "../requests/projectReq.js";
import Cookies from "js-cookie";

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

  const [entregaactual, setEntregaactual] = useState([]);
  const [iteracionactual, setIteracionactual] = useState([]);


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

  const getProject = async (project) => {
    try {
      const res = await requestgetProject(project);
      setParticipants(res.data.participants);
      setFechasproject(res.data.fechasProyecto);
      setFechasentregas(res.data.fechasEntregas);
      setFechasiteraciones(res.data.fechasIteraciones);
      setEntregaactual(res.data.entregaActual);
      setIteracionactual(res.data.iteracionActual);
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
        IsParticipant,
        create,
        getProjects,
        joinProject,
        getProject,
        getPermissions
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;