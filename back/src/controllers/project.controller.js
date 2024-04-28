import moment from 'moment-timezone';
import { SECRET_TOKEN, SECRETPASS_TOKEN } from '../config.js';
import { generarCodigo, generarEntregas } from '../libs/makerProject.js';
import { agregarUsuario, crearProyecto, projectsUsuario, verificarCodigo, verificarUnion, obtenerFechas, getParticipantsQuery, ActualizarEstado, obtenerFechasID, getRequerimientosEntrega, AgregarRequerimiento, verificarUnionCorreo, verificarNumeroParticipantes, CrearTarea, getTareas, obtenerFechasTareas, ActualizarEstadoTareas } from '../querys/projectquerys.js';
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
        if (projects.length > 0) {
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
                res.cookie(name, value);
            });
        }
        res.json(projects);
    })
}


export const joinProject = async (req, res) => {
    const FECHA_ACTUAL = moment().tz(zonaHoraria);
    try {
        const { CODIGO_UNIRSE, ID_USUARIO } = req.body;
        const proyecto = await verificarCodigo(CODIGO_UNIRSE);
        const ES_CREADOR = false;
        let REGISTRO_ACTUAL = moment(FECHA_ACTUAL).format('YYYY-MM-DD HH:mm:ss');
        if (!proyecto) return res.status(404).json({ message: ["Projecto no existente"] });
        const numeroParticipantes = await verificarNumeroParticipantes(proyecto.project[0].ID);
        if(numeroParticipantes.success) return res.status(400).json({message : ["Numero maximo de participantes alcanzado"]});
        const registrado = await verificarUnion(proyecto.project[0].ID, ID_USUARIO);
        if (registrado.success) return res.status(400).json({ message: ["Ya estas participando en el proyecto"] })
        const union = await agregarUsuario(REGISTRO_ACTUAL, ES_CREADOR, proyecto.project[0].ID, ID_USUARIO);
        if (!union.success) return res.status(500).json({ message: ["Usuario agregado con exito"] });
        return res.status(200).json({ message: ["Enlazado a proyecto correctamente"] });
    } catch (error) {
        return res.status(500).json({ message: ["Error inesperado, intentalo de nuevo"] });
    }
}

export const getPermissions = async (req, res) => {
    const { ID } = req.body;
    const namecookie = `Proyecto${ID}`;
    try {
        const cookieValue = req.cookies[namecookie];
        if (!cookieValue) return res.status(401).json({ message: ["No autorizado"] });
        jwt.verify(cookieValue, SECRET_TOKEN, async (err, user) => {
            if (err) return res.status(400).json({ message: ["Error inesperado, intentalo de nuevo"] });
            return res.json({
                ID: user.ID_PROYECTO,
                role: user.role
            });
        }
        );
    } catch (error) {
        return res.status(500).json({ message: ["Error inesperado, intentalo de nuevo"] });

    }
}

export const getProject = async (req, res) => {
    const { ID } = req.body;
    const ID_PROYECTO = ID;
    try {
        const FECHAS_PROYECTO = await obtenerFechasID("PROYECTOS", ID_PROYECTO);
        let ENTREGA_ACTUAL = "";
        let ITERACION_ACTUAL = "";
        const FECHAS_ENTREGAS = await obtenerFechasID("ENTREGAS", ID_PROYECTO);
        const FECHAS_ITERACIONES = await Promise.all(FECHAS_ENTREGAS.map(async (ENTREGA) => {
            const FECHAS_ITERACION = await obtenerFechasID("ITERACIONES", ENTREGA.ID);
            return (FECHAS_ITERACION);
        }));
        const participants = await getParticipantsQuery(ID_PROYECTO);
        FECHAS_ENTREGAS.map((ENTREGA) => {
            if (ENTREGA.ESTADO === 'En desarrollo') {
                ENTREGA_ACTUAL = ENTREGA;
            }
        });
        FECHAS_ITERACIONES.map((ITERACIONESPORENTREGA) => {
            ITERACIONESPORENTREGA.map((ITERACION) => {
                if (ITERACION.ESTADO === 'En desarrollo') {
                    ITERACION_ACTUAL = ITERACION;
                }
            })
        });

        const requerimientos = await getRequerimientosEntrega(ENTREGA_ACTUAL.ID);
        const tasks = await getTareas(ITERACION_ACTUAL.ID);

        //console.log(requerimientos);
        const data = {
            fechasProyecto: FECHAS_PROYECTO,
            fechasEntregas: FECHAS_ENTREGAS,
            fechasIteraciones: FECHAS_ITERACIONES,
            entregaActual: ENTREGA_ACTUAL,
            iteracionActual: ITERACION_ACTUAL,
            participants: participants,
            requerimientos: requerimientos,
            tasks: tasks
        };
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ messsage: ["Error inesperado, intentanlo de nuevo"] })
    }
}


export const getTasks = async (req, res) => {
    const {ID_ITERACION} = req.body;
    try {
        const tasks = await getTareas(ID_ITERACION);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ mensaje: ["Error inesperado, intentalo nuevamente"] });
    }
}

export const createTask = async (req, res) => {
    //Agregar a la tarea la tarea dependiente y el requerimiento que cumple y rol, a quien se asigna
    const { NOMBRE, DESCRIPCION, FECHA_INICIO, FECHA_TERMINO, FECHA_MAX_TERMINO, iteracionactual, ID_USUARIO, ID_REQUERIMIENTO, ROLPARTICIPANTE, ID_TAREA_DEPENDIENTE} = req.body
    console.log(req.body);
    const FECHA_ACTUAL = moment().tz(zonaHoraria);
    try {
        const FECHA_INICIO_TAREA = moment(FECHA_INICIO).tz(zonaHoraria);const FECHA_TERMINO_TAREA = moment(FECHA_TERMINO).tz(zonaHoraria);const FECHA_MAX_TERMINO_TAREA = moment(FECHA_MAX_TERMINO).tz(zonaHoraria);
        const FECHA_INICIO_ITERACION = moment(iteracionactual.FECHA_INICIO).tz(zonaHoraria);const FECHA_TERMINO_ITERACION = moment(iteracionactual.FECHA_TERMINO).tz(zonaHoraria);
        
        if(FECHA_INICIO_TAREA.isBefore(FECHA_INICIO_ITERACION)) return res.status(400).json({ message: ["La fecha debe correponder a la iteracion actual"] });
        if(FECHA_MAX_TERMINO_TAREA.isAfter(FECHA_TERMINO_ITERACION)) return res.status(400).json({ message: ["La fecha max debe correponder a la iteracion actual"] });
        if (FECHA_INICIO_TAREA.isBefore(FECHA_ACTUAL)) return res.status(400).json({ message: ["Fecha inicial incorrecta"] });
        if (FECHA_TERMINO_TAREA.isBefore(FECHA_INICIO_TAREA)) return res.status(400).json({ message: ["Fecha final incorrecta"] });
        if (FECHA_MAX_TERMINO_TAREA.isBefore(FECHA_TERMINO_TAREA)) return res.status(400).json({ message: ["Fecha final maxima incorrecta"] });
        const MINUTOS_DIFERENCIA = FECHA_TERMINO_TAREA.diff(FECHA_INICIO_TAREA, 'minutes');
        if (MINUTOS_DIFERENCIA < 120) return res.status(400).json({ message: ["Diferencia minimo de 2 horas"] });
        const MINUTOS_DIFERENCIA_MAX = FECHA_MAX_TERMINO_TAREA.diff(FECHA_TERMINO_TAREA, 'minutes');
        if (MINUTOS_DIFERENCIA_MAX < 120) return res.status(400).json({ message: ["Diferencia minimo de 2 horas en la hora maxima"] });

        const FECHA_INICIO_ITE = moment(iteracionactual.FECHA_INICIO);const FECHA_TERMINO_ITE = moment(iteracionactual.FECHA_TERMINO);
        if(FECHA_INICIO_TAREA.isBefore(FECHA_INICIO_ITE)) return res.status(400).json({message:["La fecha de inicio no correponde al de la iteracion"]})
        if(FECHA_MAX_TERMINO_TAREA.isAfter(FECHA_TERMINO_ITE)) return res.status(400).json({message: ["La fecha max de termino no corresponde a la iteracion"]})
        
        const tareacreada = await CrearTarea(NOMBRE, DESCRIPCION, FECHA_INICIO_TAREA, FECHA_TERMINO_TAREA, FECHA_MAX_TERMINO_TAREA, iteracionactual.ID, ID_USUARIO, ID_REQUERIMIENTO, ROLPARTICIPANTE, ID_TAREA_DEPENDIENTE); 
        if(!tareacreada.success) return res.status(400).json("Error al crear la tarea");
        return res.status(200).json({message: ["Tarea creada con exito"]});
    } catch (error) {
        res.status(500).json({ mensaje: ["Error inesperado, intentalo nuevamente"] });
    }
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

export const addParticipant = async (req,res) => {
    const {CORREO,ID_PROYECTO } = req.body;
    try {
        const FECHA_ACTUAL = moment().tz(zonaHoraria);
        let REGISTRO_ACTUAL = moment(FECHA_ACTUAL).format('YYYY-MM-DD HH:mm:ss');
        const ES_CREADOR = false;
        const registrado = await verificarUnionCorreo(ID_PROYECTO, CORREO);
        if (registrado.success) return res.status(400).json({ message: ["Ya esta participando en el proyecto"] })
        const numeroParticipantes = await verificarNumeroParticipantes(ID_PROYECTO);
        if(numeroParticipantes.success) return res.status(400).json({message : ["Numero maximo de participantes alcanzado"]});
        const union = await agregarUsuario(REGISTRO_ACTUAL, ES_CREADOR, ID_PROYECTO, registrado.ID_USUARIO);
        if (!union.success) return res.status(500).json({ message: ["Usuario no agregado con exito"] });
        return res.status(200).json({ message: ["Enlazado a proyecto correctamente"] });
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
    const FECHAS_TAREAS = await obtenerFechasTareas("TAREAS");
    const tiposDeFecha = [FECHAS_PROYECTO, FECHAS_ENTREGAS, FECHAS_ITERACIONES];

    await Promise.all(tiposDeFecha.map(async (fechas, index) => {
        //console.log(`Fechas del tipo ${index + 1}:`);
        await Promise.all(fechas.map(async (fecha) => {
            let fechaInicial = moment(fecha.FECHA_INICIO).tz(zonaHoraria);
            let fechaFinal = moment(fecha.FECHA_TERMINO).tz(zonaHoraria);
            if (FECHA_ACTUAL.isAfter(fechaInicial) && (fecha.ESTADO) === "En espera") {
                const actualizar = await ActualizarEstado(ESTADO[1], index, fecha.ID);
            }
            if (FECHA_ACTUAL.isAfter(fechaFinal) && (fecha.ESTADO) === "En desarrollo") {
                const actualizar = await ActualizarEstado(ESTADO[2], index, fecha.ID);
            }
        }));
    }));

    await Promise.all(FECHAS_TAREAS.map(async (fecha) => {
        let fechaInicial = moment(fecha.FECHA_INICIO).tz(zonaHoraria);
        let fechaFinal = moment(fecha.FECHA_MAX_TERMINO).tz(zonaHoraria);
        if (FECHA_ACTUAL.isAfter(fechaInicial) && (fecha.ESTADO_DESARROLLO) === "En espera") {
            const actualizar = await ActualizarEstadoTareas(ESTADO[1], fecha.ID);
        }
        if (FECHA_ACTUAL.isAfter(fechaFinal) && (fecha.ESTADO_DESARROLLO) === "En desarrollo") {
            const actualizar = await ActualizarEstadoTareas(ESTADO[2], fecha.ID);
        }
    }));


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