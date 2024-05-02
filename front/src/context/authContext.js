import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { requestLogin, requestRegister, requestLogout, requestVerify, requestReset, requestPass, requestUpdate } from "../requests/auth.js";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [IsSended, setIsSended] = useState(false);
  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [IsChanged, setIsChanged] = useState(false);

  const [autherrors, setAutherrors] = useState([]);

  const [message, setMessage] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (IsChanged) {
      const timer = setTimeout(() => {
        setIsChanged(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (autherrors.length > 0) {
      const timer = setTimeout(() => {
        setAutherrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (message.length > 0) {
      const timer = setTimeout(() => {
        setMessage([]);
        //setIsChanged(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

  }, [IsChanged,autherrors,message]);




  const signin = async (user) => {
    try {
      const res = await requestLogin(user);
      setUser(res.data);
      setIsAuthenticated(true);
      //console.log(res.data);
      //console.log(error.response.data.message);
    } catch (error) {
      //setLoginerrors(error.response.data.message);
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  };

  const signup = async (user) => {
    try {
      const res = await requestRegister(user);
      //setUser(res.data);
      setMessage(res.data.message);
    } catch (error) {
      //console.log(error.response.data.message);
      //setRegistererrors(error.response.data.message);
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  }

  const resetToken = async (user) => {
    try {
      const res = await requestReset(user);
      if (!res.data) return setIsSended(false);
      setIsSended(true);
      setMessage(res.data.message);
    } catch (error) {
      //console.log(error.response.data.message);
      //setReseterrors(error.response.data.message);
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  }

  const resetPass = async (user) => {
    try {
      //console.log(user);
      const res = await requestPass(user);
      console.log(res.data);
      setMessage(res.data.message);
    } catch (error) {
      //setResetpasserrors(error.response.data.message);
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  }

  const logout = async () => {
    try {
      const res = await requestLogout();
      //console.log(res);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  }

  const updateUser = async (user) => {
    try {
      console.log(user);
      const res = await requestUpdate(user);
      setUser(res.data);
      setMessage("Informacion Actualizada");
    } catch (error) {
      //setUpdateerrors(error.response.data.message);
      if (error.response && error.response.data && error.response.data.message) {
        setAutherrors(error.response.data.message);
      } else {
        setAutherrors("Error del servidor");
      }
    }
  }

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await requestVerify(cookies.token);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        
        autherrors,message,

        IsAuthenticated,IsSended,isLoading,IsChanged,

        setAutherrors,setMessage,
        
        signin,
        signup,
        resetToken,
        resetPass,
        updateUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;