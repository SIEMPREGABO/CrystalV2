import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { requestCreate, requestJoin, requestProjects, requestParticipants, requestFechasProject, requestFechasEntregas } from "../requests/projectReq.js";
import Cookies from "js-cookie";

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState([]);
  const [projecterrors, setProjecterrors] = useState([]);
  const [IsCreated, setIsCreated] = useState(false);
  const [IsJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState([]);
  const [projects, setProjects] = useState([]);
  const [joinerrors, setJoinerrors] = useState([]);
  const [fechaserrors, setFechaserrors] = useState([]);
  const [getParticipantserrors, setParticipantserrors] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [fechasproject, setFechasproject] = useState([]);
  const [fechasentregas, setFechasentregas] = useState([]);

  //const [IsLoading, setLoading] = useState(true);

  useEffect(() => {
    if (message.length > 0) {
      const timer = setTimeout(() => {
        setMessage([]);
        setIsCreated(true);
        setIsJoined(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (projecterrors.length > 0 || joinerrors.length > 0 || getParticipantserrors.length > 0 || fechaserrors.length > 0) {
      const timer = setTimeout(() => {
        setProjecterrors([]);
        setJoinerrors([]);
        setParticipantserrors([]);
        setFechaserrors([]);
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

  }, [IsCreated, projecterrors, message, joinerrors, IsJoined, getParticipantserrors, fechaserrors]);



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
      //const cookies = Cookies.get();
      const res = await requestProjects();
      setProjects(res.data);
      //setIsCreated(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setProjecterrors(error.response.data.message);
      } else {
        setProjecterrors("Error del servidor");
      }
    }
  };

  const getParticipants = async (project) => {
    try {
      const res = await requestParticipants(project);
      //console.log(res.data);
      setParticipants(res.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setParticipantserrors(error.response.data.message);
      } else {
        setParticipantserrors("Error del servidor");
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

  const getFechasProyecto = async (project) => {
    try {
      const res = await requestFechasProject(project);
      //console.log(res.data);
      setFechasproject(res.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setFechaserrors(error.response.data.message);
      } else {
        setFechaserrors("Error del servidor");
      }
    }
  }

  const getFechasEntregas = async (project) => {
    try {
      const res = await requestFechasEntregas(project);
      //console.log(res.data);
      setFechasentregas(res.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setFechaserrors(error.response.data.message);
      } else {
        setFechaserrors("Error del servidor");
      }
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        projects,
        projecterrors,
        IsCreated,
        message,
        joinerrors,
        participants,
        getParticipantserrors,
        fechaserrors,
        fechasproject,
        fechasentregas,
        create,
        getProjects,
        joinProject,
        getParticipants,
        getFechasProyecto,
        getFechasEntregas
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;