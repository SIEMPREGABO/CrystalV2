import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';
import moment from "moment";
import { useEffect } from "react";
import { useProject } from "../context/projectContext";
import { joinSchema } from "../schemas/project";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import {
    GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu,
    Filter, Page, ExcelExport, PdfExport, Edit, Inject
} from '@syncfusion/ej2-react-grids';
import { ordersData, contextMenuItems, ordersGrid } from '../data/dummy';
import { Header } from '../components';

export const Panel = () => {
    const { user } = useAuth();
    const fecha = moment.utc(user.FECHA_CREACION).format('DD-MM-YYYY');
    const { getProjects, projects, joinerrors, joinProject, message, IsJoined } = useProject();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(joinSchema)
    });

    const onSubmit = handleSubmit(async (values) => {
        const data = {
            ID_USUARIO: user.ID,
            CODIGO_UNIRSE: values.CODIGO_UNIRSE
        }
        joinProject(data);
        //navigate("/panel");

    })

    useEffect(() => {
        getProjects();

    }, []);

    useEffect(() => {
        if (message.length > 0) {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);


    return (
        <div>
            <div className="container-fluid position-relative p-4">
                {joinerrors && <div className=" bg-danger mt-2 me-2 text-white shadow">{joinerrors}</div>}
                {message && <div className=" bg-success mt-2 me-2 text-white shadow">{message}</div>}
                <div className="container-sm">
                    <div className="row justify-content-evenly d-md-flex flex-md-equal w-100 my-md-3 p-md-3 mx-auto">
                        <div className="text-bg-dark overflow-hidden col">
                            <div className="mt-3 pt-3 ms-5 ps-5">
                                <h2 className="display-5">Bienvenido {user.NOMBRE_USUARIO}
                                </h2>
                                <p className="lead">ID: {(user.ID).toString().padStart(5, '0')}</p>
                                <p className="lead">Unido desde {fecha}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card ">
                        <div className="card-header">
                            Tus proyectos activos
                        </div>
                        <ul className="list-group list-group-flush text-start">
                            {projects &&
                                <div>
                                    {projects.map((project) => (
                                        <Link className="list-group-item text-start" to={`/Proyecto/${(project.ID).toString().padStart(5, '0')}`} key={project.ID}>
                                            Nombre del proyecto: {project.NOMBRE} <strong className="fw-light" style={{ fontSize: '10px' }}>ID del proyecto: {(project.ID).toString().padStart(5, '0')}</strong>

                                        </Link>
                                    ))}
                                </div>}
                            {!projects &&
                                <p className="list-group-item text-start">No tienes proyectos</p>
                            }
                            <div>
                            </div>
                        </ul>
                        <div className="card-body row justify-content-evenly">
                            <div className="col">
                                <form className="" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="p-2 px-4 row justify-content-evenly">
                                        <input
                                            className="col"
                                            type="text"
                                            name="CODIGO_UNIRSE"
                                            placeholder="Código del Proyecto"
                                            {...register("CODIGO_UNIRSE", { required: true, message: "campo requerido" })}
                                        />
                                        <div className="col">
                                            <input className=" btn btn-dark btn-custom-register " type="submit" value="Unirse a proyecto" />
                                        </div>
                                    </div>
                                </form>
                                {errors.CODIGO_UNIRSE && <div className=" bg-danger mt-2 me-2 text-white shadow">{errors.CODIGO_UNIRSE.message}</div>}
                            </div>
                            <div className="col text-center pe-5 pt-2">
                                <Link className="btn btn-dark btn-custom-register" to="/configurar-proyecto">Crear Proyecto</Link>
                            </div>
                            <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'><Header category="Page" title="Proyectos" />
                                <GridComponent dataSource={projects} allowPaging allowSorting>
                                    <ColumnsDirective>
                                        <ColumnDirective field='ID' headerText='ID del proyecto' />
                                        <ColumnDirective field='NOMBRE' headerText='Nombre del proyecto' />
                                        {/* Aquí puedes agregar más columnas según la estructura de tus proyectos */}
                                    </ColumnsDirective>
                                    <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
                                </GridComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Panel;