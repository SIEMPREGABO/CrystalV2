import z from 'zod';

//Hacer un schema para proyectos
export const projectSchema = z.object({
    NOMBRE_PROYECTO: z.string().nonempty({
        message: 'El nombre del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Nombre de proyecto invalido" }
    ),
    OBJETIVO: z.string().nonempty({
        message: 'El objetivo del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Objetivo invalido" }
    ),
    DESCRIPCION_GNRL: z.string().nonempty({
        message: 'El descripcion del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Descripción invalida" }
    ),
    FECHA_INICIO: z.string().nonempty({
        message: 'La fecha de inicio es requerida'
    }),
    FECHA_TERMINO: z.string().nonempty({
        message: 'La fecha de termino es requerda'
    }),
    ENTREGAS: z.string().nonempty({
        message: 'Las entregas son requeridas'
    })
})

export const joinSchema = z.object({
    CODIGO_UNIRSE: z.string().nonempty({
        message: 'El codigo es requerido'
    }).regex(
        new RegExp(/^[A-Z0-9]{5}$/), { message: "Código inválido" }
    )
})

export const addSchema = z.object({
    CORREO: z.string().nonempty({
        message: "El email es requerido"
    }).regex(
        new RegExp(/^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/),{ message: 'Correo Invalido' }
    )
})

export const taskSchema = z.object({
    NOMBRE: z.string().nonempty({
        message: 'El nombre es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Descripción invalida" }
    ),
    DESCRIPCION: z.string().nonempty({
        message: 'El descripcion del proyecto es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Descripción invalida" }
    ),
    FECHA_INICIO: z.string().nonempty({
        message: 'La fecha de inicio es requerida'
    }),
    FECHA_TERMINO: z.string().nonempty({
        message: 'La fecha de termino es requerida'
    }),
    FECHA_MAX_TERMINO: z.string().nonempty({
        message: 'La fecha max es requerida'
    }),
    HORAINICIO: z.string().nonempty({
        message: 'La hora inicio es requerida'
    }),
    HORAENTREGA: z.string().nonempty({
        message: 'La hora de entrega es requerida'
    }),
    HORAMAXIMA: z.string().nonempty({
        message: 'La hora max es requerida'
    }),
    ID_REQUERIMIENTO: z.string().nonempty({
        message: 'El requerimiento es requerido'
    }),
    ROLPARTICIPANTE: z.string().nonempty({
        message: 'El rol es requerido'
    }),
    ID_USUARIO: z.string().nonempty({
        message: 'El id de usuario es requerido'
    }), ID_TAREA_DEPENDIENTE: z.string().optional()

})

export const requerimientoSchema = z.object({
    OBJETIVO: z.string().nonempty({
        message: 'El objetivo es requerido'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Descripción invalida" }
    ),
    DESCRIPCION: z.string().nonempty({
        message: 'La descripcion es requerida'
    }).regex(
        new RegExp(/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/), { message: "Descripción invalida" }
    ),
    TIPO_REQ: z.string().nonempty({
        message: 'El tipo es requerido'
    })
})