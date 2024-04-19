import React, { useEffect, useState } from "react";
import { BrowserRouter,Route, Routes, useNavigate, useParams } from "react-router-dom";
import Usuario from "./Usuarios.jsx";
import Chat from "./Chat.js";
import Configuracion from "./Config.js"
import Calendario from "./Calendario.jsx";
import AsignarTarea from "./AsignarTarea.jsx";
import Dashboard from "./Inicio.jsx";
import Entregas from "./Entregas.js";
import {Proyectos} from "./Proyecto.jsx"
import Kanban from "./Kanban.jsx"
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Sidebar, ThemeSettings, Navbar } from "../components/index.jsx";
import { useProject } from "../context/projectContext.js";
import { useStateContext } from '../context/Provider.js';

export const Proyecto = () => {
    const { id } = useParams();
    const [isAdmin, setIsAdmin] = useState(true);

    const { activeMenu, themeSettings, setthemeSettings, currentColor, currentMode } = useStateContext();

    const { getProject, project } = useProject();

    const navigate = useNavigate();

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
                    {themeSettings && <ThemeSettings />}
                        <Routes>
                            {/* Proteger las rutas autorizadas */}
                            {isAdmin && <Route path="" element={<Dashboard />} />}
                            {isAdmin && <Route path="participantes" element={<Usuario />} />}
                            {isAdmin && <Route path="asignar-tarea" element={<AsignarTarea />} />}
                            {isAdmin && <Route path="proyecto" element={<Proyecto />} />}
                            {isAdmin && <Route path="calendario" element={<Calendario />} />}
                            {isAdmin && <Route path="chat" element={<Chat />} />}
                            {isAdmin && <Route path="entregas" element={<Entregas />} />}
                            {isAdmin && <Route path="configuracion" element={<Configuracion />} />}
                            {isAdmin && <Route path="kanban" element={<Kanban />} />}

                            {!isAdmin && <Route path="" element={<Dashboard />} />}
                            {!isAdmin && <Route path="asignartarea" element={<AsignarTarea />} />}
                            {!isAdmin && <Route path="calendario" element={<Calendario />} />}
                            {!isAdmin && <Route path="chat" element={<Chat />} />}
                        </Routes>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Proyecto;