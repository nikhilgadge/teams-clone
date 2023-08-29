import axios from "../api/axios";
import useAuth from "./useAuth";

export default function useLogout() {
  const { setAuth } = useAuth();
  const logout = async () => {
    try {
      await axios.get("/auth/logout", {
        withCredentials: true,
      });
      setAuth({});
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
}
