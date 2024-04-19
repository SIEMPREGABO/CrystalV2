import { Navigate, Outlet } from "react-router-dom";
import { useProject } from "../context/projectContext";

function ProtectProject(){
    const { IsParticipant} = useProject();
    console.log(IsParticipant,"protect");

    if(!IsParticipant) {
        return <Navigate to="/panel" replace/>;
    }
    return <Outlet />
    
}

export default ProtectProject;