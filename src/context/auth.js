import { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [auth, setAuth] = useState();
  const [persist, setPersist] = useLocalStorage("persist", false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
        setIsSocketConnected,
        isSocketConnected,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
