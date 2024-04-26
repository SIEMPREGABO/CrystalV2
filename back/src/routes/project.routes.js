import { Router } from "express";
import { validarToken } from "../middlewares/validate.token.js";
import { getTasks, createTask, getTask, updateTask, deleteTask, createProject, obtenerMensajes, getProjects, joinProject,getProject, getPermissions, agregarRequerimiento  } from "../controllers/project.controller.js";
import { createSchema, joinSchema, taskSchema } from "../schemas/project.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router  = Router();

router.post('/createProject',validateSchema(createSchema), createProject)
router.get('/getProjects' ,getProjects);
router.post('/joinProject',validateSchema(joinSchema),joinProject);
router.post('/getPermissions', getPermissions);
router.post('/addRequirement', agregarRequerimiento);
//router.post('/getParticipants', getParticipants);
//router.post('/getFechasProject', getFechasProject);
//router.post('/getFechasEntregas', getFechasEntregas);
router.post('/getProject', getProject);
router.get('/mensajes', obtenerMensajes);
router.get('/tasks', validarToken ,getTasks);
router.post('/createTask',validateSchema(taskSchema),createTask);
//router.get('/tasks/:id', validarToken ,getTask)
//router.delete('/tasks/:id', validarToken ,deleteTask)
//router.put('/tasks/:id', validarToken ,updateTask)

export default router;