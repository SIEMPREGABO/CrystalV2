import { promise } from "zod";
import moment from "moment-timezone";
import { getConnection } from "../database.js";
import { generarIteraciones } from '../libs/makerProject.js';
import { zonaHoraria } from '../config.js';

export function crearProyecto(NOMBRE_PROYECTO, OBJETIVO, DESCRIPCION, FECHA_CREACION, FECHA_INICIO, FECHA_TERMINO, ENTREGAS, CODIGO_UNICO, ID) {
    return new Promise(async (resolve, reject) => {
        const ID_CATEGORIA_CRYSTAL = 1;
        const ESTADO = "En espera";
        const connection = await getConnection();
        const registerquery = 'INSERT INTO PROYECTOS (NOMBRE, OBJETIVO, DESCRIPCION_GNRL, FECHA_CREACION, FECHA_INICIO, FECHA_TERMINO,ESTADO, NUMERO_ENTREGAS, CODIGO_UNIRSE, ID_CATEGORIA_CRYSTAL) VALUES (?,?,?,?,?,?,?,?,?,?)';
        const insertarquery = 'INSERT INTO U_SEUNE_P (FECHA_UNION, ES_CREADOR, ID_PROYECTO,ID_USUARIO) VALUES (?,?,?,?)';

        connection.query(registerquery, [NOMBRE_PROYECTO, OBJETIVO, DESCRIPCION, FECHA_CREACION, FECHA_INICIO, FECHA_TERMINO, ESTADO, ENTREGAS, CODIGO_UNICO, ID_CATEGORIA_CRYSTAL], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.affectedRows > 0) {
                    const ID_PROYECTO = results.insertId;
                    const ES_CREADOR = true;
                    connection.query(insertarquery, [FECHA_CREACION, ES_CREADOR, ID_PROYECTO, ID], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (results.affectedRows > 0) {
                                resolve({ success: true, ID_P: ID_PROYECTO });
                            } else {
                                resolve({ success: false });
                            }
                        }
                    });
                } else {
                    resolve({ success: false });
                }
            }
        });
    });
};

export function agregarUsuario(FECHA_CREACION, ES_CREADOR, ID_PROYECTO, ID) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const insertarquery = 'INSERT INTO U_SEUNE_P (FECHA_UNION, ES_CREADOR, ID_PROYECTO,ID_USUARIO) VALUES (?,?,?,?)';
        connection.query(insertarquery, [FECHA_CREACION, ES_CREADOR, ID_PROYECTO, ID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.affectedRows > 0) {
                    resolve({ success: true, ID_P: ID_PROYECTO });
                } else {
                    resolve({ success: false });
                }
            }
        });
    });
}

export function verificarCodigo(CODIGO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'SELECT * FROM PROYECTOS WHERE CODIGO_UNIRSE = ?';
        connection.query(query, [CODIGO], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    resolve({ success: true, project: results });
                } else {
                    resolve(false);
                }
            }
        });
    });
}

export function verificarUnion(ID_PROYECTO, ID_USUARIO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'SELECT * FROM U_SEUNE_P WHERE ID_PROYECTO = ? AND ID_USUARIO = ? ';
        connection.query(query, [ID_PROYECTO, ID_USUARIO], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    resolve({ success: true, project: results });
                } else {
                    resolve(false);
                }
            }
        });
    });
}

export function eliminarParticipante(ID_PROYECTO, ID_USUARIO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'DELETE FROM U_SEUNE_P WHERE ID_PROYECTO = ? AND ID_USUARIO = ?;';
        connection.query(query, [ID_PROYECTO, ID_USUARIO], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.affectedRows > 0) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            }
        })
    })
}

export function delegarParticipante(ID_PROYECTO, ID_USUARIO, ID_admin) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'UPDATE U_SEUNE_P SET ES_CREADOR = 1 WHERE ID_PROYECTO = ? AND ID_USUARIO = ?;';
        const queryAdmin = 'UPDATE U_SEUNE_P SET ES_CREADOR = 0 WHERE ID_PROYECTO = ? AND ID_USUARIO = ?;';

        connection.query(query, [ID_PROYECTO, ID_USUARIO], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.affectedRows > 0) {
                    connection.query(queryAdmin, [ID_PROYECTO, ID_admin], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (results.affectedRows > 0) {
                                resolve({ success: true });
                            } else {
                                resolve({ success: false });
                            }
                        }
                    })

                } else {
                    resolve({ success: false });
                }
            }
        })
    })
}

export function eliminarProyecto(ID_PROYECTO) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection();
        try {
            await conn.beginTransaction();
            const deleteTareasDependenciasQuery = `
                DELETE FROM T_DEPENDE_T WHERE ID_TAREA_DEPENDIENTE IN(
                    SELECT ID FROM TAREAS WHERE ID_ITERACION IN(
                        SELECT ID FROM ITERACIONES WHERE ID_ENTREGA IN (
                            SELECT ID FROM ENTREGAS WHERE ID_PROYECTO = ?
                        )
                    )
                )
            `;
            await conn.query(deleteTareasDependenciasQuery, [ID_PROYECTO]);

            const deleteColaboracionesQuery = `
                DELETE FROM COLABORACIONES WHERE ID_TAREA_REALIZADA IN(
                    SELECT ID FROM TAREAS WHERE ID_ITERACION IN(
                        SELECT ID FROM ITERACIONES WHERE ID_ENTREGA IN (
                            SELECT ID FROM ENTREGAS WHERE ID_PROYECTO = ?
                        )
                    )
                )
            `;
            await conn.query(deleteColaboracionesQuery, [ID_PROYECTO]);


            const deleteChatsQuery = `
            DELETE FROM CHATS_ITERACIONES WHERE ID_ITERACION IN (
                SELECT ID FROM ITERACIONES WHERE ID_ENTREGA IN (
                    SELECT ID FROM ENTREGAS WHERE ID_PROYECTO = ?
                )
            )
        `;
            await conn.query(deleteChatsQuery, [ID_PROYECTO]);

            const deleteTareasQuery = `
                DELETE FROM TAREAS WHERE ID_ITERACION IN (
                    SELECT ID FROM ITERACIONES WHERE ID_ENTREGA IN (
                        SELECT ID FROM ENTREGAS WHERE ID_PROYECTO = ?
                    )
                )
            `;
            await conn.query(deleteTareasQuery, [ID_PROYECTO]);

            const deleteRequerimientosQuery = `
                DELETE FROM REQUERIMIENTOS WHERE ID_ENTREGA IN (
                    SELECT ID FROM ENTREGAS WHERE ID_PROYECTO = ?
                )
            `;
            await conn.query(deleteRequerimientosQuery, [ID_PROYECTO]);

            const deleteIteracionesQuery = `
                DELETE FROM ITERACIONES WHERE ID_ENTREGA IN (
                    SELECT ID FROM ENTREGAS WHERE ID_PROYECTO = ?
                )
            `;
            await conn.query(deleteIteracionesQuery, [ID_PROYECTO]);

            const deleteEntregasQuery = 'DELETE FROM ENTREGAS WHERE ID_PROYECTO = ?';
            await conn.query(deleteEntregasQuery, [ID_PROYECTO]);

            const deleteUsuariosQuery = 'DELETE FROM U_SeUne_P WHERE ID_PROYECTO = ?';
            await conn.query(deleteUsuariosQuery, [ID_PROYECTO]);

            const deleteProyectoQuery = 'DELETE FROM PROYECTOS WHERE ID = ?';
            await conn.query(deleteProyectoQuery, [ID_PROYECTO]);

            await conn.commit();
            resolve({success: true});
        } catch (error) {
            await conn.rollback();
            reject({success:false})
        } finally {
            // Cerrar la conexión
            await conn.end();
        }

    })
}

export function eliminarChats(ID_ITERACION) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection();
        try {
            await conn.beginTransaction();

            const deleteChatsQuery = `
            DELETE FROM CHATS_ITERACIONES WHERE ID_ITERACION = ?`;
            await conn.query(deleteChatsQuery, [ID_ITERACION]);

            await conn.commit();
            resolve({success: true});
        } catch (error) {
            await conn.rollback();
            reject({success:false})
        } finally {
            // Cerrar la conexión
            await conn.end();
        }

    })
}

export function verificarUnionCorreo(ID_PROYECTO, CORREO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const queryUser = 'SELECT ID FROM USUARIO WHERE CORREO = ?';
        const query = 'SELECT * FROM U_SEUNE_P WHERE ID_PROYECTO = ? AND ID_USUARIO = ? ';
        connection.query(queryUser, [CORREO], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    const ID_USUARIO = results[0].ID;
                    connection.query(query, [ID_PROYECTO, ID_USUARIO], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (results.length > 0) {
                                resolve({ success: true, isRegister: true });
                            } else {
                                resolve({ success: false, isRegister: true, ID_USUARIO: ID_USUARIO });
                            }
                        }
                    })
                } else {
                    resolve({ isRegister: false });
                }
            }
        });
    });
}

export function getUser(ID_USUARIO) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const query = 'SELECT CORREO FROM USUARIO WHERE ID = ?';
            connection.query(query, [ID_USUARIO], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    if (results.length > 0) {
                        resolve(results);
                    }
                }
            })
        } catch (error) {
            reject(error);
        }
    });
}

/*
export function RegistarConfigQuery(PROYECTO, ENTREGAS, ITERACIONES) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const query = `UPDATE PROYECTOS SET FECHA_INICIO = ?, FECHA_TERMINO = ? WHERE ID = ?`;
            connection.query(query, [PROYECTO.StartTime, PROYECTO.EndTime, PROYECTO.ID], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    const entregasPromises = ENTREGAS.map(async (ENTREGA) => {
                        const queryEntrega = `UPDATE ENTREGAS SET FECHA_INICIO = ?, FECHA_TERMINO = ? WHERE ID = ?`;
                        const EntregaData = await new Promise((resolve, reject) => {
                            connection.query(queryEntrega, [ENTREGA.StartTime, ENTREGA.EndTime, ENTREGA.Id_entrega], (err, results) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    const iteracionesPromises = ITERACIONES.map((ITERACION) => {
                                        const queryIteracion = `UPDATE ITERACIONES SET FECHA_INICIO = ?, FECHA_TERMINO = ? WHERE ID = ?`;
                                        const EntregaData = await new Promise((resolve, reject) => {
                                            connection.query(queryIteracion, [ITERACION.StartTime, ITERACION.EndTime, ITERACION.ID_iteracion], (err, results) => {
                                                if (err) {
                                                    reject(err)
                                                } else {
                                                    resolve({ success: true });
                                                }
                                            });
                                        });
                                        return ({ success: EntregaData.success });
                                    });
                                    Promise.all(iteracionesPromises)
                                        .then((iteraciones) => {
                                            resolve({ success: true });
                                        })
                                        .catch((err) => {
                                            reject(err);
                                        });
                                }
                            });
                            return ();
                        });
                    });

                    resolve
                }
            });
        } catch (error) {
            reject(error);
        }
    })
}*/

export function ActualizarFechasQuery(TABLA, OBJETIVO) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            let query;

            if (TABLA === 'proyectos') {
                query = `UPDATE PROYECTOS SET FECHA_INICIO = ?, FECHA_TERMINO = ? WHERE ID = ?`;
            }
            if (TABLA === 'entregas') {
                query = `UPDATE ENTREGAS SET FECHA_INICIO = ?, FECHA_TERMINO = ? WHERE ID = ?`;
            }
            if (TABLA === 'iteraciones') {
                query = `UPDATE ITERACIONES SET FECHA_INICIO = ?, FECHA_TERMINO = ? WHERE ID = ?`;
            }
            console.log(TABLA, OBJETIVO);
            connection.query(query, [OBJETIVO.StartTime, OBJETIVO.EndTime, OBJETIVO.ID], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    if(results.affectedRows > 0){
                        resolve({success: true});
                    }else{
                        reject({success: false});
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    })
}

export function verificarNumeroParticipantes(ID_PROYECTO) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const query = 'SELECT * FROM U_SEUNE_P WHERE ID_PROYECTO = ? ';
        connection.query(query, [ID_PROYECTO], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length < 20) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            }
        });
    });
}

export function projectsUsuario(ID) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const usuarioQuery = 'SELECT ID_PROYECTO, ES_CREADOR FROM U_SEUNE_P WHERE ID_USUARIO = ?';
        const projectQuery = `SELECT NOMBRE, ID, ESTADO, CONVERT_TZ(FECHA_INICIO, '+00:00', '-06:00') AS FECHA_INICIO, CONVERT_TZ(FECHA_TERMINO, '+00:00', '-06:00') AS FECHA_TERMINO FROM PROYECTOS WHERE ID = ?`;
        connection.query(usuarioQuery, [ID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    const projectsPromises = results.map(async (result) => {
                        const ID_PROYECTO = result.ID_PROYECTO;
                        const ES_CREADOR = result.ES_CREADOR;
                        const projectData = await new Promise((resolve, reject) => {
                            connection.query(projectQuery, [ID_PROYECTO], (err, projectResults) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({ NOMBRE: projectResults[0].NOMBRE, ID: projectResults[0].ID, ESTADO: projectResults[0].ESTADO, FECHA_INICIO: projectResults[0].FECHA_INICIO, FECHA_TERMINO: projectResults[0].FECHA_TERMINO });
                                }
                            });
                        });
                        return { admin: ES_CREADOR, NOMBRE: projectData.NOMBRE, ID: projectData.ID, ESTADO: projectData.ESTADO, FECHA_INICIO: projectData.FECHA_INICIO, FECHA_TERMINO: projectData.FECHA_TERMINO };
                    });
                    Promise.all(projectsPromises)
                        .then((projects) => {
                            resolve(projects);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    resolve(false);
                }
            }
        });
    });
}

export function registrarEntrega(RETROALIMENTACION, ESTADO, FECHA_INICIO, FECHA_TERMINO, ID_PROYECTO) {
    return new Promise(async (resolve, reject) => {
        const FIN = moment(FECHA_TERMINO).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        const query = 'INSERT INTO ENTREGAS (RETROALIMENTACION,ESTADO,FECHA_INICIO ,FECHA_TERMINO,ID_PROYECTO) VALUES (?,?,?,?,?)';
        connection.query(query, [RETROALIMENTACION, ESTADO, FECHA_INICIO, FIN, ID_PROYECTO], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.affectedRows > 0) {
                    resolve(true);
                    generarIteraciones(moment(FECHA_INICIO), moment(FECHA_TERMINO), results.insertId);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

export function registrarIteracion(OBJETIVO, ESTADO, FECHA_INICIO, FECHA_TERMINO, ID_ENTREGA) {
    return new Promise(async (resolve, reject) => {
        const FIN = moment(FECHA_TERMINO).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        const connection = await getConnection();
        const query = 'INSERT INTO ITERACIONES  (OBJETIVO,ESTADO,FECHA_INICIO ,FECHA_TERMINO,ID_ENTREGA) VALUES (?,?,?,?,?)';
        connection.query(query, [OBJETIVO, ESTADO, FECHA_INICIO, FIN, ID_ENTREGA], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.affectedRows > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

export function obtenerFechas(tabla) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const query = `SELECT ID, FECHA_INICIO, FECHA_TERMINO, ESTADO FROM ${tabla}`;
            connection.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function obtenerFechasTareas(tabla) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const query = `SELECT ID, FECHA_INICIO,FECHA_TERMINO, FECHA_MAX_TERMINO, ESTADO_DESARROLLO FROM ${tabla}`;
            connection.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function obtenerTareasDep() {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const query = "SELECT * FROM T_DEPENDE_T";
            const queryDep = "SELECT ESTADO_DESARROLLO FROM TAREAS WHERE ID = ?";
            connection.query(query, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    if (results.length > 0) {
                        const TasksPromises = results.map(async (result) => {
                            const ID_TAREA_DEP = result.ID_TAREA_DEPENDIENTE;
                            const ID_TAREA_SUB = result.ID_SUBTAREA;
                            const TasksData = await new Promise((resolve, reject) => {
                                connection.query(queryDep, [ID_TAREA_DEP], (err, resultsDep) => {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        connection.query(queryDep, [ID_TAREA_SUB], (err, resultsSub) => {
                                            if (err) {
                                                reject(err)
                                            } else {
                                                resolve({ TAREA_DEP: resultsDep[0].ESTADO_DESARROLLO, TAREA_SUB: resultsSub[0].ESTADO_DESARROLLO })
                                            }
                                        })
                                    }
                                })
                            });
                            return { ID_TAREA_DEP: ID_TAREA_DEP, TAREA_DEP: TasksData.TAREA_DEP, ID_TAREA_SUB: ID_TAREA_SUB, TAREA_SUB: TasksData.TAREA_SUB };
                        })

                        Promise.all(TasksPromises)
                            .then((Tasks) => {
                                resolve(Tasks);
                            })
                            .catch((err) => {
                                reject(err);
                            });

                    } else {
                        resolve([])
                    }
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}
/*
export const autorizarFechasProject(ID){
    return new Promise(async(resolve, reject)=>{
        try {
            const connection = await getConnection();
            const query = "SELECT "
        } catch (error) {
            reject(error);
        }
    })
}
*/
export function obtenerFechasID(tabla, ID) {
    return new Promise(async (resolve, reject) => {
        try {
            let query = ""
            const connection = await getConnection();
            if (tabla === "PROYECTOS") {
                query = `SELECT ID, FECHA_INICIO,  FECHA_TERMINO, ESTADO, NOMBRE,OBJETIVO,DESCRIPCION_GNRL,CODIGO_UNIRSE, FECHA_CREACION,ID_CATEGORIA_CRYSTAL  FROM ${tabla} WHERE ID = ?`
            } else if (tabla === "ENTREGAS") {
                query = `SELECT ID,  FECHA_INICIO,  FECHA_TERMINO, ESTADO, ID_PROYECTO FROM ${tabla} WHERE ID_PROYECTO = ?`
            } else if (tabla === "ITERACIONES") {
                query = `SELECT ID,   FECHA_INICIO,  FECHA_TERMINO, ESTADO, ID_ENTREGA FROM ${tabla} WHERE ID_ENTREGA = ?`
            }
            //const query = `SELECT ID, FECHA_INICIO, FECHA_TERMINO, ESTADO FROM ${tabla} WHERE ID = ?`;
            connection.query(query, [ID], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function obtenerFechasConfigID(tabla, ID) {
    return new Promise(async (resolve, reject) => {
        try {
            let query = ""
            const connection = await getConnection();
            if (tabla === "PROYECTOS") {
                query = `SELECT ID, FECHA_INICIO,  FECHA_TERMINO, ESTADO, NOMBRE,OBJETIVO,DESCRIPCION_GNRL,CODIGO_UNIRSE, FECHA_CREACION,ID_CATEGORIA_CRYSTAL  FROM ${tabla} WHERE ID = ?`
            } else if (tabla === "ENTREGAS") {
                query = `SELECT ID,  FECHA_INICIO,  FECHA_TERMINO, ESTADO, ID_PROYECTO FROM ${tabla} WHERE ID = ?`
            } else if (tabla === "ITERACIONES") {
                query = `SELECT ID,   FECHA_INICIO,  FECHA_TERMINO, ESTADO, ID_ENTREGA FROM ${tabla} WHERE ID = ?`
            }
            //const query = `SELECT ID, FECHA_INICIO, FECHA_TERMINO, ESTADO FROM ${tabla} WHERE ID = ?`;
            connection.query(query, [ID], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function GetTareasxIteracion(ID_PROYECTO) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();

            const entregasquery = `
SELECT 
    e.ID,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", i.ID,
                "tareas", (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            "nombre", nombre,
                            "est_desarr", estado_desarrollo
                        )
                    ) 
                    FROM TAREAS 
                    WHERE ID_ITERACION = i.ID
                )
            )
        ) 
        FROM iteraciones i 
        WHERE ID_ENTREGA = e.ID
    ) AS ITERACIONES 
FROM entregas e 
WHERE ID_PROYECTO = ?;
`;

            //const entregasquery = "SELECT e.ID, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.ID, 'tareas', (SELECT JSON_ARRAYAGG(JSON_OBJECT('nombre', nombre, 'est_desarr', estado_desarrollo)) FROM TAREAS WHERE ID_ITERACION = i.ID))) FROM iteraciones i WHERE ID_ENTREGA = e.ID) AS ITERACIONES FROM entregas e WHERE ID_PROYECTO = ?;";
            //const iteracionesquery = "SELECT ID FROM ITERACIONES WHERE ID_ENTREGA = ?";
            //const tareasquery = "SELECT NOMBRE, ESTADO_DESARROLLO FROM TAREAS WHERE ID_ITERACION = ?";

            connection.query(entregasquery, [ID_PROYECTO], async (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        resolve([]);
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function getRequerimientosEntrega(ID_ENTREGA) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const query = 'SELECT ID, OBJETIVO, DESCRIPCION, ID_TIPO_REQUERIMIENTO, ID_ENTREGA FROM REQUERIMIENTOS WHERE ID_ENTREGA = ?';
            connection.query(query, [ID_ENTREGA], async (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

export function getTareas(ID_ITERACION) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const query = 'SELECT MAX(c.ID_USUARIO) AS ID_USUARIO, c.ID_TAREA_REALIZADA,  MAX(c.ROL_REALIZADO) AS ROL_REALIZADO, MAX(t.ESTADO_DESARROLLO) AS ESTADO_DESARROLLO FROM COLABORACIONES c  JOIN TAREAS t ON c.ID_TAREA_REALIZADA = t.ID WHERE c.ID_ITERACION = 3 AND t.ESTADO_DESARROLLO NOT LIKE "cerrada" group by c.ID_TAREA_REALIZADA ;';
            const querytask = `SELECT ID, CONVERT_TZ(FECHA_INICIO, '+00:00', '-06:00') AS FECHA_INICIO,CONVERT_TZ(FECHA_TERMINO, '+00:00', '-06:00') AS FECHA_TERMINO, CONVERT_TZ(FECHA_MAX_TERMINO, '+00:00', '-06:00') AS FECHA_MAX_TERMINO,NOMBRE,DESCRIPCION,ESTADO_DESARROLLO,ID_REQUERIMIENTO,DESCRIPCION FROM TAREAS WHERE ID_ITERACION = ? AND ESTADO_DESARROLLO NOT LIKE "cerrada"`;
            connection.query(querytask, [ID_ITERACION], async (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    if (results.length > 0) {
                        //console.log(results);
                        resolve(results);
                    } else {
                        //console.log("vacio");
                        resolve([]);
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    })
}

export function DeleteTask(ID_TAREA) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            console.log("El ID EN LA QUERY ES: " + ID_TAREA)
            const dependenttaskquery = "SELECT * FROM T_DEPENDE_T WHERE ID_TAREA_DEPENDIENTE = ?"
            const deletetQuery = "DELETE FROM TAREAS WHERE ID = ?;"
            const deletecQuery = "DELETE FROM COLABORACIONES WHERE ID_TAREA_REALIZADA = ?;"
            connection.query(dependenttaskquery, [ID_TAREA], async (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        console.log("si hay tareas dependientes");
                        reject("Esta tarea Tiene tareas que dependen de ella");
                    } else {
                        console.log("no hay tareas dependientes");
                        connection.query(deletecQuery, [ID_TAREA], async (errc, resultsc) => {
                            if (errc) {
                                reject(errc);
                            } else {
                                if (resultsc.affectedRows > 0) {
                                    console.log("eliminando colaboraciones");
                                    connection.query(deletetQuery, [ID_TAREA], async (errt, resultst) => {
                                        if (errt) {
                                            reject(errt);
                                        } else {
                                            console.log("eliminando tarea");
                                            resolve("Tarea Eliminada Correctamente");
                                        }
                                    });
                                } else {
                                    console.log("no hay resultados para esta tarea en colaboraciones")
                                }
                            }
                        });
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    })
}

export function UpdateTask(ID, NOMBRE, DESCRIPCION, ESTADO_DESARROLLO, FECHA_INICIO, FECHA_MAX_TERMINO) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const updatequery = "UPDATE TAREAS SET NOMBRE=?, DESCRIPCION=?, ESTADO_DESARROLLO=?, FECHA_INICIO=?, FECHA_MAX_TERMINO=? WHERE ID = ?";

            connection.query(updatequery, [NOMBRE, DESCRIPCION, ESTADO_DESARROLLO, FECHA_INICIO, FECHA_MAX_TERMINO, ID], async (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.affectedRows > 0) {
                        resolve(true);
                    } else {
                        reject("Ha habido un problema al actualizar la tarea");
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

export function GetTareasKanban(ID_ITERACION) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();

            const kanbanquery = 'select c.ID_TAREA_REALIZADA, u.NOMBRE_USUARIO as Desarrollador, t.*, r.OBJETIVO FROM COLABORACIONES c JOIN USUARIO u ON c.ID_USUARIO=U.ID JOIN TAREAS t ON c.ID_TAREA_REALIZADA = t.ID JOIN REQUERIMIENTOS r  ON t.ID_REQUERIMIENTO = r.ID WHERE t.ID_ITERACION = ? ;'

            connection.query(kanbanquery, [ID_ITERACION], async (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        resolve([]);
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}


export function getParticipantsQuery(ID_PROYECTO) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const query = 'SELECT ID_USUARIO, FECHA_UNION, ES_CREADOR FROM U_SEUNE_P WHERE ID_PROYECTO = ?';
            const queryusers = "SELECT NOMBRE_USUARIO, NUMERO_BOLETA  FROM USUARIO WHERE ID = ?"
            connection.query(query, [ID_PROYECTO], async (err, results) => {
                if (err) {
                    reject(err);
                } else {

                    const promises = results.map(async (result) => {
                        const role = result.ES_CREADOR;
                        const Userdata = await new Promise((resolve, reject) => {
                            connection.query(queryusers, [result.ID_USUARIO], (err, Users) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(Users[0])
                                }
                            })
                        })
                        return {
                            NOMBRE_USUARIO: Userdata.NOMBRE_USUARIO,
                            ROLE: role,
                            ID_USUARIO: result.ID_USUARIO,
                            FECHA_UNION: moment(result.FECHA_UNION).tz(zonaHoraria).format("YYYY-MM-DD"),
                            NUMERO_BOLETA: Userdata.NUMERO_BOLETA
                        };
                    })
                    const users = await Promise.all(promises);
                    resolve(users);
                }
            })



        } catch (error) {
            reject(error);
        }
    })
}

export function ActualizarEstado(ESTADO, TABLA, ID) {
    return new Promise(async (resolve, reject) => {
        try {
            let query = "";
            const connection = await getConnection();
            if (TABLA === 0) {
                query = 'UPDATE PROYECTOS SET ESTADO = ? WHERE ID = ?';
                console.log("Proyecto: ", ID, " se escuentra en: ", ESTADO);

            } else if (TABLA === 1) {
                query = 'UPDATE ENTREGAS SET ESTADO = ? WHERE ID = ?';
                console.log("Entrega: ", ID, " se escuentra en: ", ESTADO);
            } else if (TABLA === 2) {
                query = 'UPDATE ITERACIONES SET ESTADO = ? WHERE ID = ?';
                console.log("Iteracion: ", ID, " se escuentra en: ", ESTADO);
            }
            connection.query(query, [ESTADO, ID], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.affectedRows > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

export function ActualizarEstadoTareas(ESTADO, ID) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            let query = '';
            if (ESTADO === "Cerrada") {
                const now = new Date();

                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
                const day = String(now.getDate()).padStart(2, '0');

                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                const fecha_termino = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                query = 'UPDATE TAREAS SET ESTADO_DESARROLLO = ?, FECHA_TERMINO = ? WHERE ID = ?';
                connection.query(query, [ESTADO, fecha_termino, ID], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.affectedRows > 0) {
                            resolve({success: true});
                            console.log("Tarea id: ", ID, " se escuentra en: ", ESTADO);
                        } else {
                            resolve({success: false});
                        }
                    }
                })
            } else {
                query = 'UPDATE TAREAS SET ESTADO_DESARROLLO = ? WHERE ID = ?';
                connection.query(query, [ESTADO, ID], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.affectedRows > 0) {
                            resolve({success: true});
                            console.log("Tarea id: ", ID, " se escuentra en: ", ESTADO);
                        } else {
                            resolve({success: false});
                        }
                    }
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

export function AgregarRequerimiento(OBJETIVO, REQUERIMIENTO, ID_TIPO_REQUERIMIENTO, ID_ENTREGA) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const requirementsquery = "INSERT INTO REQUERIMIENTOS (OBJETIVO, DESCRIPCION, ID_TIPO_REQUERIMIENTO, ID_ENTREGA) VALUES (?,?,?,?);";
        let idtipo;

        if ((typeof ID_TIPO_REQUERIMIENTO) == "number") {
            console.log("la variable es un numero");
            idtipo = ID_TIPO_REQUERIMIENTO;
        } else if ((typeof ID_TIPO_REQUERIMIENTO) == "string") {
            console.log("la variable es una cadena");
            if (ID_TIPO_REQUERIMIENTO == "Cambio") {
                idtipo = 6;
            } else if (ID_TIPO_REQUERIMIENTO == "Requerimiento") {
                idtipo = 1;
            } else {
                idtipo = ID_TIPO_REQUERIMIENTO;
            }
        }
        /*if(ID_TIPO_REQUERIMIENTO === 'cambio'){
            idtipo = 6;  
            console.log(typeof idtipo);
        }else{
            idtipo= 1;
            console.log(typeof idtipo);
        }*/
        connection.query(requirementsquery, [OBJETIVO, REQUERIMIENTO, idtipo, ID_ENTREGA], (error, results) => {
            if (error) {
                reject(error);
            } else if (results.affectedRows > 0) {
                resolve({ success: true });
            } else {
                resolve({ success: false });
            }
        });
    })
}

export function getTareaDependiente(ID_TAREA_DEPENDIENTE) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const query = "SELECT  NOMBRE,DESCRIPCION,ESTADO_DESARROLLO, CONVERT_TZ(FECHA_INICIO, '+00:00', '-06:00') AS FECHA_INICIO,FECHA_TERMINO ,CONVERT_TZ(FECHA_MAX_TERMINO, '+00:00', '-06:00') AS FECHA_MAX_TERMINO,ID_REQUERIMIENTO,ID_ITERACION FROM TAREAS WHERE ID = ?;"
            connection.query(query, [ID_TAREA_DEPENDIENTE], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        resolve({ success: true, task: results })
                    } else {
                        resolve({ success: false });
                    }

                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

export function CrearTarea(NOMBRE, DESCRIPCION, FECHA_INICIO, FECHA_MAX_TERMINO, ID_iteracion, ID_USUARIO, ID_REQUERIMIENTO, ROLPARTICIPANTE, ID_TAREA_DEPENDIENTE) {
    return new Promise(async (resolve, reject) => {
        try {
            let rol;
            let ESTADO_DESARROLLO;
            if (ROLPARTICIPANTE === "Diseñador Principal") rol = 1;
            if (ROLPARTICIPANTE === "Diseñador") rol = 3;
            if (ROLPARTICIPANTE === "Embajador") rol = 2;
            const connection = await getConnection();
            if (ID_TAREA_DEPENDIENTE !== '') {
                ESTADO_DESARROLLO = "Bloqueada"
            } else {
                ESTADO_DESARROLLO = "En espera"
            }

            const query = "INSERT INTO TAREAS(NOMBRE,DESCRIPCION,ESTADO_DESARROLLO,FECHA_INICIO,FECHA_MAX_TERMINO,ID_REQUERIMIENTO, ID_ITERACION) VALUES (?,?,?,?,?,?,?);";
            const queryColab = "INSERT INTO COLABORACIONES (ID_USUARIO, ID_ITERACION, ID_TAREA_REALIZADA, ROL_REALIZADO) VALUES (?,?,?,?)";
            const queryDependencia = "INSERT INTO T_DEPENDE_T (ID_TAREA_DEPENDIENTE, ID_SUBTAREA) VALUES (?,?)"
            connection.query(query, [NOMBRE, DESCRIPCION, ESTADO_DESARROLLO, FECHA_INICIO, FECHA_MAX_TERMINO, ID_REQUERIMIENTO, ID_iteracion], (err, results) => {
                if (err) {
                    reject(err)
                    //console.log("mamw", err)
                } else {
                    if (results.affectedRows > 0) {
                        const id_tarea_creada = results.insertId;
                        connection.query(queryColab, [ID_USUARIO, ID_iteracion, id_tarea_creada, rol], (err, results) => {
                            if (err) {
                                reject(err)
                                console.log(err);
                            } else {
                                if (results.affectedRows > 0) {
                                    if (ID_TAREA_DEPENDIENTE !== '') {
                                        connection.query(queryDependencia, [ID_TAREA_DEPENDIENTE, id_tarea_creada], (err, results) => {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                if (results.affectedRows > 0) {
                                                    resolve({ success: true })
                                                } else {
                                                    resolve({ success: false })
                                                }
                                            }
                                        })
                                    } else {
                                        resolve({ success: true })
                                    }
                                } else {
                                    resolve({ success: false })
                                }
                            }
                        })
                    } else {
                        resolve({ success: false })
                    }
                }
            })
        } catch (error) {
            reject(error)
        }

    })
}


export function AgregarMensaje(CONTENIDO, FECHA, HORA, USUARIO, ITERACION) {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        const messagesquery = "INSERT INTO CHATS_ITERACIONES (CONTENIDO, FECHA_ENVIO, HORA_ENVIO, ID_USUARIO_ENVIA, ID_ITERACION) VALUES (?,?,?,?,?);";
        console.log("AgregarMensaje pq");
        connection.query(messagesquery, [CONTENIDO, FECHA, HORA, USUARIO, ITERACION], (error, results) => {
            if (error) {
                console.log(error);
                reject(error);
            } else if (results.affectedRows > 0) {
                resolve({ success: true });
            } else {
                resolve({ success: false });
                console.log(error);
            }
        });
    })
}

export function GetMessages(ID_iteracion) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await getConnection();
            const chatquery = 'SELECT c.*, u.NOMBRE_USUARIO FROM CHATS_ITERACIONES c JOIN  USUARIO u ON c.ID_USUARIO_ENVIA = u.ID WHERE ID_ITERACION = 1 ORDER BY c.HORA_ENVIO;';

            connection.query(chatquery, [ID_iteracion], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}