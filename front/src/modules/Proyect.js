import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Participantes from "./Usuario";
import Chat from "./Chat";
import Configuracion from "./Config.js"
import Calendario from "./Calendario.jsx";
import AsignarTarea from "./AsignarTarea.jsx";
import Dashboard from "./Inicio.jsx";
import Entregas from "./Entregas.js";
import Kanban from "./Kanban.jsx"
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Sidebar, ThemeSettings, Navbar } from "../components";
import { useProject } from "../context/projectContext.js";
import { useStateContext } from '../context/Provider.js';

export const Proyecto = () => {
    const { id } = useParams();
    const [isAdmin, setIsAdmin] = useState(true);
    const idint = parseInt(id, 10).toString();
    const { activeMenu, themeSettings, setthemeSettings, currentColor, currentMode } = useStateContext();

    const { getProject, project, getPermissions } = useProject();

    const navigate = useNavigate();




    useEffect(() => {
        getPermissions(idint);
        //console.log(id);
        //if (!isAdmin && !isProgramador) {
            // Si el usuario no es ni administrador ni programador, redirigir al dashboard.
        //    navigate("/panel");
        //}
    }, [])


    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <div className="flex relative dark:bg-main-dark-bg">
                <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
                    <TooltipComponent content="Settings" position="Top">
                        <button
                            type="button"
                            className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                            onClick={() => setthemeSettings(true)}
                            style={{ background: currentColor, borderRadius: '50%' }}
                        >
                            <FiSettings />
                        </button>
                    </TooltipComponent>
                </div>

                {activeMenu ? (
                    <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                        <Sidebar />
                    </div>
                ) : (
                    <div className="w-0 dark:secondary-dark-bg">
                        <Sidebar />
                    </div>
                )}

                <div
                    className={
                        activeMenu
                            ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
                            : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
                    }
                >
                    <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                        <Navbar />
                    </div>

                    <div>
                        <Routes>
                            {themeSettings && <ThemeSettings />}
                            {/* Proteger las rutas autorizadas */}
                            {isAdmin && <Route path="" element={<Dashboard />} />}
                            {isAdmin && <Route path="Participantes" element={<Participantes />} />}
                            {isAdmin && <Route path="Asignartarea" element={<AsignarTarea />} />}
                            {isAdmin && <Route path="Calendario" element={<Calendario />} />}
                            {isAdmin && <Route path="Chat" element={<Chat />} />}
                            {isAdmin && <Route path="Entregas" element={<Entregas />} />}
                            {isAdmin && <Route path="Configuracion" element={<Configuracion />} />}
                            {isAdmin && <Route path="Kanban" element={<Kanban />} />}

                            {!isAdmin && <Route path="" element={<Dashboard />} />}
                            {!isAdmin && <Route path="Asignartarea" element={<AsignarTarea />} />}
                            {!isAdmin && <Route path="Calendario" element={<Calendario />} />}
                            {!isAdmin && <Route path="Chat" element={<Chat />} />}
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Proyecto;