import { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [auth, setAuth] = useState();
  const [persist, setPersist] = useLocalStorage("persist", false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
        setIsSocketConnected,
        isSocketConnected,
        remoteEmailId,
        setRemoteEmailId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
