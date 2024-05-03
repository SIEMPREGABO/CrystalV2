import axios from './axios.js';


export const requestCreate = async project => axios.post(`/createProject`,project);
export const requestJoin = async joinable => axios.post(`/joinProject`,joinable);
export const requestProjects = async () => axios.get(`/getProjects`);
export const requestParticipants = async project => axios.post(`/getParticipants`, project);
export const requestFechasProject = async project => axios.post(`/getFechasProject`, project);
export const requestFechasEntregas = async project => axios.post(`/getFechasEntregas`, project);
export const requestAddRequirement = async project => axios.post('/addRequirement', project);
export const requestAddMessage = async message => axios.post('/addMessage', message);
export const requestMessages = async iteracion => axios.post('/getMessages', iteracion);
export const requestGetTareas = async project => axios.post('/getTareas', project);

//export const requestLogout = () => axios.post(`/logout`);
//export const requestReset = async user => axios.post(`/reset`,user); 

