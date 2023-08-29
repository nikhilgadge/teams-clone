import axios from "../api/axios";
import useAuth from "./useAuth";

export default function useRefreshToken() {
  const { setAuth } = useAuth();
  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refreshToken", {
        withCredentials: true,
      });

      setAuth({
        accessToken: response.data.accessToken,
        user: response.data.user,
      });

      return response.data.accessToken;
    } catch (error) {
      setAuth({
        accessToken: undefined,
        user: undefined,
      });

      return null;
    }
  };
  return refresh;
}
