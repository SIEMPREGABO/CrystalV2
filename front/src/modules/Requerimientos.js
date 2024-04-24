import styles from '../css/voicereq.module.css';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProject } from "../context/projectContext.js";
import { zodResolver } from '@hookform/resolvers/zod';

export const Requerimientos = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const {createRequirements, entregaactual, requirementerrors, message} = useProject();
    
    const onSubmit = handleSubmit(async (values) => {
      const data = {
        OBJETIVO: values.OBJETIVO,
        DESCRIPCION: values.DESCRIPCION,
        TIPO: values.TIPO_REQ,
        ID_ENTREGA: 1
      };

      createRequirements(data);
    });

    return (
        <div className={styles.App}>
            <header className={styles['App-header']}>
            <div className={styles.container}>
                <h1 className={styles.titulo}>Agregar Requerimiento</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-1">
                    <label  className={styles.labels}>Objetivo: </label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" name="OBJETIVO" 
                           placeholder="objetivo del requerimiento"
                           {...register("OBJETIVO", {required:true, message: "Campo Requerido"})} />
                </div>
                <div className="mb-1">
                    <label  className={styles.labels}>Descripción: </label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" name="DESCRIPCION" 
                              rows="3" placeholder='describe el requerimiento'
                              {...register("DESCRIPCION", {required:true, message: "Campo Requerido"})}></textarea>
                </div>
                <div className="mb-1">
                    <label  className={styles.labels}>Tipo de Requerimiento: </label>
                    <select {...register("TIPO_REQ", {required: true, message: "Campo Requerido"})} className='form-select' defaultValue="0">
                        <option value="0" >Selecciona el tipo de requerimiento</option>
                        <option value="1">Requerimiento Funcional</option>
                        <option value="2">Requerimiento No Funcional</option>
                        <option value="3">Requerimiento de Rendimiento</option>
                        <option value="4">Requerimiento de Seguridad</option>
                        <option value="5">Requerimiento de Calidad</option>
                        <option value="6">Solicitud de Cambio</option>
                    </select>
                </div>
                <div className='mt-3 row'>
                    <div className='mt-3 d-flex justify-content-center'>
                    <button type="submit" className="btn btn-primary">Agregar</button>
                    </div>
                </div>
                </form>
            </div>
            </header>
        </div>
    );
}

export default Requerimientos;