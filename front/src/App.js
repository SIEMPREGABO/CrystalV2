import Header from './modules/Header';
import Home from './modules/Home';
import Login from './modules/Login';
import Register from './modules/Register';
import { Routes, Route } from 'react-router-dom';
import Panel from './modules/Panel.js';
import Reset from './modules/Reset.js';
import ResetPass from './modules/ResetPass.js';
import './/css/App.css';
import { AuthProvider } from './context/authContext.js';
import ProtectedRoute from './ProtectedRoute';
import Footer from "./modules/Footer.js";
import Proyecto from "./modules/Proyect.jsx"
import FormProyect from './modules/FormProyect.js';
import ConfigProfile from './modules/ConfigProfile.js';
import { ProjectProvider } from './context/projectContext.js';
import { ContextProvider } from "./context/Provider";

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
      <ContextProvider>
        <Header/>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/resetpass/:token" element={<ResetPass />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/panel" element={<Panel />} />
              <Route path="/configurar-proyecto" element={<FormProyect />} />
              <Route path="/configurar-perfil" element={<ConfigProfile />} />
              <Route path="/proyecto/:id/*" element={<Proyecto />} />
            </Route>
          </Routes>
        </ContextProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}



export default App;