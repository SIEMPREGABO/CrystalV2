import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../context/Provider';
import avatar from '../data/avatar.jpg';
import { useAuth } from '../context/authContext';
import { useProject } from '../context/projectContext';

const PerfilUsuario = () => {
  const { user } = useAuth();
  const { userRol} = useProject();
  const { currentColor } = useStateContext();
  let rol = "Participante";
  if(userRol){
    rol = "Administrador"
  }

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      
      <div className="flex gap-5 items-center mt-2 border-color border-b-1 pb-6">
        
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {user.NOMBRE_PILA} {user.APELLIDO_PATERNO} </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">  {rol}  </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {user.CORREO} </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="10px"
          width="full"
        />
      </div>
    </div>

  );
};

export default PerfilUsuario;