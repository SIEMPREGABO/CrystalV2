import moment from 'moment-timezone';
import { SECRET_TOKEN } from '../config.js';
import { generarCodigo, generarEntregas } from '../libs/makerProject.js';
import { agregarUsuario, crearProyecto, projectsUsuario, verificarCodigo, verificarUnion, obtenerFechas, getParticipantsQuery, ActualizarEstado, obtenerFechasID , AgregarRequerimiento, AgregarMensaje, GetMessages, GetTareasProject } from '../querys/projectquerys.js';
import jwt from 'jsonwebtoken'
import { zonaHoraria } from '../config.js';
import { createProjectToken } from '../libs/jwt.js';

import { array } from 'zod';
//import { resetSchema } from '../../../frontend/src/schemas/auth.js';

export const createProject = async (req, res) => {
    const FECHA_ACTUAL = moment().tz(zonaHoraria);
    const { NOMBRE_PROYECTO, OBJETIVO, DESCRIPCION_GNRL, FECHA_INICIO, FECHA_TERMINO, ENTREGAS, ID } = req.body;
    console.log(req.body);
    try {
        //NOMBRE_PROYECTO, OBJETIVOS, DESCRIPCION, FECHA_ACTUAL, FECHA_INICIO, FECHA_TERMINO, ENTREGAS
        const FECHA_INICIAL = moment(FECHA_INICIO).tz(zonaHoraria).add(1, 'days');
        const FECHA_FINAL = moment(FECHA_TERMINO).tz(zonaHoraria).endOf('day');

        if (FECHA_INICIAL.isBefore(FECHA_ACTUAL)) return res.status(400).json({ message: ["Fecha inicial incorrecta"] });
        if (FECHA_FINAL.isBefore(FECHA_INICIAL)) return res.status(400).json({ message: ["Fecha final incorrecta"] });

        const DIAS_PROYECTO = FECHA_FINAL.diff(FECHA_INICIAL, 'days') + 1;

        if (DIAS_PROYECTO < 90) return res.status(400).json({ message: ["El proyecto debe durar minimo 3 meses"] });
        if (DIAS_PROYECTO > 365) return res.status(400).json({ message: ["El proyecto debe durar maximo 1 año"] });

        let REGISTRO_ACTUAL = moment(FECHA_ACTUAL).format('YYYY-MM-DD HH:mm:ss');
        let REGISTRO_INICIAL = moment(FECHA_INICIAL).format('YYYY-MM-DD HH:mm:ss');
        let REGISTRO_FINAL = moment(FECHA_FINAL).format('YYYY-MM-DD HH:mm:ss');

        const CODIGO_UNICO = await generarCodigo();

        const generarProyecto = await crearProyecto(NOMBRE_PROYECTO, OBJETIVO, DESCRIPCION_GNRL, REGISTRO_ACTUAL, REGISTRO_INICIAL, REGISTRO_FINAL, ENTREGAS, CODIGO_UNICO, ID);
        if (!generarProyecto.success) return res.status(400).json({ message: ["Error al crear el proyecto"] });

        const ARREGLOPROYECTO = generarEntregas(ENTREGAS, FECHA_INICIAL, FECHA_FINAL, generarProyecto.ID_P);
        if (!ARREGLOPROYECTO) return res.status(400).json({ message: ["Error al crear las entregas e iteraciones"] });
        return res.status(200).json({ messsage: ["Proyecto creado con exito"] });
    } catch (error) {
        res.status(500).json({ message: [error.message] });
        //destruirProyecto(idProyecto,ID);  
    }
}

export const getProjects = async (req, res) => {
    const token = req.cookies['token'];
    if (!token) return res.status(401).json({ message: ["No autorizado"] });
    jwt.verify(token, SECRET_TOKEN, async (error, user) => {
        if (error) return res.status(401).json({ message: ["No autorizado"] });
        const projects = await projectsUsuario(user.id);
        const projectCookies = {};
        if(projects.length > 0){
            await Promise.all(projects.map(async (project) => {
                let role = 'participant';
                if (project.admin) {
                    role = 'admin'
                }
    
                const payload = {
                    ID_PROYECTO: project.ID,
                    role: role
                };
                const projectToken = await createProjectToken(payload);
                projectCookies[`Proyecto${project.ID}`] = projectToken;
            }));
            Object.entries(projectCookies).forEach(([name, value]) => {
                res.cookie(name, value, { httpOnly: true });
            });
        }
        res.json(projects);
    })
}

export const getParticipants = async (req,res) => {
    const {ID_PROYECTO} = req.body;
    try {
        //if(!ID_PROYECTO) return res.status(500).json({message:["Error en el servidor"]});
        const participants = await getParticipantsQuery(ID_PROYECTO);

        //participants.map((participant)=>{
        //    console.log(participant.NOMBRE_USUARIO, participant.ID_USUARIO, participant.FECHA_UNION, participant.NUMERO_BOLETA);
        //});

        res.json(participants);
    } catch (error) {
        res.status(500).json({message:["Error en el servidor"]})
    }
}

export const joinProject = async (req, res) => {
    const FECHA_ACTUAL = moment().tz(zonaHoraria);

    try {
        const { CODIGO_UNIRSE, ID_USUARIO } = req.body;
        //console.log(req.body);
        const proyecto = await verificarCodigo(CODIGO_UNIRSE);
        const ES_CREADOR = false;
        let REGISTRO_ACTUAL = moment(FECHA_ACTUAL).format('YYYY-MM-DD HH:mm:ss');
        if (!proyecto) return res.status(404).json({ message: ["Projecto no existente"] });
        const registrado = await verificarUnion(proyecto.project[0].ID, ID_USUARIO);
        if (registrado.success) return res.status(400).json({ message: ["Ya estas participando en el proyecto"] })
        const union = await agregarUsuario(REGISTRO_ACTUAL, ES_CREADOR, proyecto.project[0].ID, ID_USUARIO);
        if (!union.success) return res.status(500).json({ message: ["Usuario agregado con exito"] });
        return res.status(200).json({ message: ["Enlazado a proyecto correctamente"] });
    } catch (error) {
        return res.status(500).json({ message: ["Error inesperado, intentalo de nuevo"] });
    }
}

export const getFechasProject = async (req,res) => {
    const {ID_PROYECTO} = req.body;
    try {
        const FECHAS_PROYECTO = await obtenerFechasID("PROYECTOS",ID_PROYECTO);
        return res.json(FECHAS_PROYECTO);

    } catch (error) {
        return res.status(500).json({messsage:["Error inesperado, intentanlo de nuevo"]})
    }
}

export const getFechasEntregas = async (req,res) =>{
    const {ID_PROYECTO} = req.body;
    try {
        const FECHAS_ENTREGAS =  await obtenerFechasID("ENTREGAS",ID_PROYECTO);
        //console.log(FECHAS_ENTREGAS);
        const FECHAS_ITERACIONES = await Promise.all(FECHAS_ENTREGAS.map(async (ENTREGA)=>{
            //console.log(ENTREGA.ID);
            const FECHAS_ITERACION = await obtenerFechasID("ITERACIONES",ENTREGA.ID)
            return(FECHAS_ITERACION);
        }))
        /*FECHAS_ITERACIONES.map((ITERACIONPORENTREGA)=>{
            ITERACIONPORENTREGA.map((ITERACION)=>{
                console.log(ITERACION.ID);
            })
        })*/
        
        const data = {
            fechasEntregas: FECHAS_ENTREGAS,
            fechasIteraciones: FECHAS_ITERACIONES
        };
        const fechasenviadas = data.fechasIteraciones;
        //console.log(data.fechasIteraciones);
        fechasenviadas.map((ITERACIONPORENTREGA)=>{
            ITERACIONPORENTREGA.map((ITERACION)=>{
                console.log(ITERACION.ID);
            })
        })

        //return res.json(data);
    } catch (error) {
        return res.status(500).json({message:["Error inesperado, intentalo de nuevo"]})
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await getTasks();
        if (!tasks.success) res.status(500).json({ mensaje: ["Error en la base de datos"] });
        if (tasks.vacio) res.status(200).json({ mensaje: ["No hay mensajes por mostrar"] });
        res.status(200).json({
            tasks: tasks.results
        });
    } catch (error) {
        res.status(500).json({ mensaje: ["Error inesperado, intentalo nuevamente"] });
    }
}

export const createTask = async (req, res) => {
    const { titulo, descripcion, fecha } = req.body

    const newTask = new Task({
        titulo,
        descripcion,
        fecha
    })

    const saveTask = await newTask.save();
    res.json(saveTask);
}

export const getTask = async (req, res) => {
    const taskFound = await Task.findById(req.params.id)

    if (!taskFound) return res.status(404).json({ message: "Tarea no encontrada" })

    res.json(taskFound)
}

export const updateTask = async (req, res) => {
    const taskFound = await Task.updateOne(req.params.id, req.body, { new: true })

    if (!taskFound) return res.status(404).json({ message: "Tarea no encontrada" })

    res.json(taskFound)



}

export const deleteTask = async (req, res) => {
    const taskFound = await Task.findByIdAndDelete(req.params.id)
    if (!taskFound) return res.status(404).json({ message: "Tarea no encontrada" })
    res.json({ message: "tarea eliminada" })
    //res.json(taskFound)
}

export const obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await getMensajes();
        if (!mensajes.success) res.status(500).json({ mensaje: ["Error en la base de datos"] });
        if (mensajes.vacio) res.status(200).json({ mensaje: ["No hay mensajes por mostrar"] });
        res.status(200).json({
            mensajes: mensajes.results
        });
    } catch (error) {
        res.status(500).json({ mensaje: ["Error inesperado, intentalo nuevamente"] });
    }
}

export const activarTareasInactivas = async (req, res) => {
    const ESTADO = ["En espera", "En desarrollo", "Finalizado"];
    const FECHA_ACTUAL = moment().tz(zonaHoraria);
    const FECHAS_PROYECTO = await obtenerFechas("PROYECTOS");
    const FECHAS_ENTREGAS = await obtenerFechas("ENTREGAS");
    const FECHAS_ITERACIONES = await obtenerFechas("ITERACIONES");
    const tiposDeFecha = [FECHAS_PROYECTO, FECHAS_ENTREGAS, FECHAS_ITERACIONES];

    await Promise.all(tiposDeFecha.map(async (fechas,index) => {
        //console.log(`Fechas del tipo ${index + 1}:`);
        await Promise.all(fechas.map(async (fecha) => {
            let fechaInicial = moment(fecha.FECHA_INICIO).tz(zonaHoraria);
            let fechaFinal = moment(fecha.FECHA_TERMINO).tz(zonaHoraria);
            if (FECHA_ACTUAL.isAfter(fechaInicial) && (fecha.ESTADO) === "En espera" ) {
                const actualizar = await ActualizarEstado(ESTADO[1],index,fecha.ID);
            }
            if (FECHA_ACTUAL.isAfter(fechaFinal) && (fecha.ESTADO) === "En desarrollo") {
                const actualizar = await ActualizarEstado(ESTADO[2],index,fecha.ID);
            }
        }));
    }));
    console.log("Im alive");
    setTimeout(activarTareasInactivas, 10 * 60 * 1000);
}

export const agregarRequerimiento = async (req, res) =>{
    try{
        const {OBJETIVO, DESCRIPCION, TIPO, ID_ENTREGA} = req.body;
        const agregar_requerimiento = await AgregarRequerimiento(OBJETIVO, DESCRIPCION, TIPO, ID_ENTREGA);

        if(!agregar_requerimiento.success) res.status(500).json({ mensaje: ["Error al agregar el requerimiento"] });
        return res.status(200).json({ messsage: ["Requerimiento creado con éxito"] });
    }catch(error){
        res.status(500).json({ message: [error.message] });
    }
}

export const agregarMensaje = async (req, res) => {
    try{
        const {CONTENIDO, FECHA, HORA, USUARIO, ITERACION} = req.body;
        const agregar_mensaje = await AgregarMensaje(CONTENIDO, FECHA, HORA, USUARIO, ITERACION);
        console.log("agregarMensaje pc");
        if(!agregar_mensaje.success) res.status(500).json({ mensaje: ["Error al enviar mensaje"] });
        return res.status(200).json({ messsage: ["Mensaje enviado con éxito"] });
    }catch(error){
        res.status(500).json({message: [`el error es: ${error.message}`]});
    }
}

export const getMessages = async (req, res) => {
    const {ID_ITERACION} = req.body;
    //console.log(req.body);
    try{
        const messages = await GetMessages(ID_ITERACION);
    
        res.json(messages);
    } catch (error) {
        res.status(500).json({message:["Error en el servidor al intentar obtener mensajes"]})
    }
}

export const getTareas = async (req, res) => {
    const {ID_PROYECT} = req.body;

    try{
        const tareas = await GetTareasProject(ID_PROYECT);

        res.json(tareas);
    }catch(error){
        res.status(500).json({message:["Error en el servidor al intentar obtener tareas de proyecto"]});
    }
}