import React from "react";



export const Config = () => {

    return (
        <div className="container-md ">
            <div className="container-fluid position-relative p-4 text-center">

                <div className="p-3 mb-3 text-center">
                    <h1>Ajustes del proyecto</h1>
                </div>


                <div className="row pt-3 pb-3">
                    <div className="col">
                        <label className="pe-3">Fecha de Inicio: </label>
                        <input
                            className="btn btn-info"
                            type="date"
                            name="fechainicio"

                        />
                    </div>
                    <div className=" col">
                        <label className="pe-3" >Fecha de finalización:</label>
                        <input
                            className="btn btn-info"
                            type="date"
                            name="fechatermino"
                        />
                    </div>
                </div>

                

                <div className="row pt-3 pb-3">
                    <div className="col text-end pt-2 ">
                        <label>Días para  la constitución del proyecto:</label>
                    </div>
                    <div className="col text-start ps-5">
                        <select className="btn btn-info dropdown-toggle px-3 mb-1" aria-label="Large select example">
                            <option selected>Días</option>
                            <option value="1">3</option>
                            <option value="2">4</option>
                            <option value="3">5</option>
                        </select>

                    </div>
                </div>

                <div className="row pt-3 pb-3">
                    <div className="col text-end pt-2">
                        <label>Entregas del proyecto:</label>
                    </div>
                    <div className="col text-start ps-5">
                        <select className="btn btn-info dropdown-toggle px-3 mb-1" aria-label="Large select example">
                            <option selected>Entregas</option>
                            <option value="1">3</option>
                            <option value="2">4</option>
                            <option value="3">5</option>
                        </select>

                    </div>
                </div>

                <div className="row pt-3 pb-3">
                    <div className="col text-end pt-2">
                        <label>Iteraciones por entrega:</label>
                    </div>
                    <div className="col text-start ps-5">
                        <select className="btn btn-info btn-xs dropdown-toggle px-3 mb-1" aria-label="Large select example">
                            <option selected>Iteraciones</option>
                            <option value="1">3</option>
                            <option value="2">4</option>
                            <option value="3">5</option>
                        </select>
                    </div>
                </div>

                <div className="row pt-3 pb-3">
                    <div className="col text-end pt-2">
                        <label>Delegar puesto a participante:</label>
                    </div>
                    <div className="col text-start ps-5">
                        <select className="btn btn-info dropdown-toggle px-3 mb-1" aria-label="Large select example">
                            <option selected>Usuario</option>
                            <option value="1">3</option>
                            <option value="2">4</option>
                            <option value="3">5</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 row">
                    <div className="col text-end pe-5">
                        <input className=" btn btn-dark btn-lg " type="submit" value="Guardar" />
                    </div>
                    <div className="col text-center ps-5">
                        <input className=" btn btn-danger btn-lg" type="submit" value="Eliminar Proyecto" />
                    </div>
                </div>


            </div>
        </div>
    );
}

export default Config;