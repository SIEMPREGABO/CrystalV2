import axios from './axios.js';


export const requestCreate = async project => axios.post(`/createProject`,project);
export const requestJoin = async joinable => axios.post(`/joinProject`,joinable);
export const requestProjects = async () => axios.get(`/getProjects`);
export const requestPermissions = async id => axios.post(`/getPermissions`, id);
export const requestgetProject = async id => axios.post(`/getProject`, id);
export const requestCreateTask = async task => axios.post(`/createTask`,task);
export const requestAddRequirement = async project => axios.post('/addRequirement', project);



//export const requestParticipants = async project => axios.post(`/getParticipants`, project);
//export const requestFechasProject = async project => axios.post(`/getFechasProject`, project);
//export const requestFechasEntregas = async project => axios.post(`/getFechasEntregas`, project);
//export const requestLogout = () => axios.post(`/logout`);
//export const requestReset = async user => axios.post(`/reset`,user); 

