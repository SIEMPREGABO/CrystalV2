import { Router } from "express";
import { validarToken } from "../middlewares/validate.token.js";
import { getTasks, createTask, createProject, obtenerMensajes, getProjects, 
    joinProject,getProject, getPermissions, agregarRequerimiento, agregarMensaje, getMessages, 
    addParticipant,
    deleteParticipant} from "../controllers/project.controller.js";
import { createSchema, joinSchema, taskSchema } from "../schemas/project.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router  = Router();

router.post('/createProject',validateSchema(createSchema), createProject)
router.get('/getProjects' ,getProjects);
router.post('/joinProject',validateSchema(joinSchema),joinProject);
router.post('/addParticipant',addParticipant); //schema
router.post('/deleteParticipant',deleteParticipant);
router.post('/getPermissions', getPermissions);
router.post('/addRequirement', agregarRequerimiento); //schema
router.post('/getProject', getProject);
router.get('/tasks', validarToken ,getTasks);
router.post('/createTask',validateSchema(taskSchema),createTask);
router.post('/addMessage', agregarMensaje);
router.post('/getMessages', getMessages);

export default router;