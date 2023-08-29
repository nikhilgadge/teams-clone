import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
export default function useAxiosPrivate() {
  const refresh = useRefreshToken();
  useEffect(() => {
    const responseIntercepter = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          (error?.response?.status === 403 ||
            error?.response?.status === 401) &&
          !prevRequest?.triedOnce
        ) {
          prevRequest.triedOnce = true;
          const newAccessToken = await refresh();
          if (newAccessToken) return axiosPrivate(prevRequest);
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercepter);
    };
  }, [refresh]);

  return axiosPrivate;
}
