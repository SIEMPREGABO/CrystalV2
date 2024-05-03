import { Router } from "express";
import { validarToken } from "../middlewares/validate.token.js";
import { getTasks, createTask, getTask, updateTask, deleteTask, createProject, obtenerMensajes, getProjects, joinProject, getParticipants, getFechasProject, getFechasEntregas, agregarRequerimiento, agregarMensaje, getMessages, getTareas } from "../controllers/project.controller.js";
import { createSchema, joinSchema, taskSchema } from "../schemas/project.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router  = Router();

router.post('/createProject',validateSchema(createSchema), createProject)
router.get('/getProjects' ,getProjects);
router.post('/joinProject',validateSchema(joinSchema),joinProject);
router.post('/getParticipants', getParticipants);
router.post('/getFechasProject', getFechasProject);
router.post('/getFechasEntregas', getFechasEntregas);
router.get('/mensajes', obtenerMensajes);
router.get('/tasks', validarToken ,getTasks);
router.post('/tasks',validateSchema(taskSchema), validarToken ,createTask);
router.post('/addRequirement', agregarRequerimiento);
router.post('/addMessage', agregarMensaje);
router.post('/getMessages', getMessages);
router.post('/getTareas', getTareas);
//router.get('/tasks/:id', validarToken ,getTask)
//router.delete('/tasks/:id', validarToken ,deleteTask)
//router.put('/tasks/:id', validarToken ,updateTask)

export default router;