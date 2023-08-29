import React, { useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

export default function Admin() {
  const [message, setMessage] = useState();
  const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const getData = async () => {
    try {
      const response = await axiosPrivate.get("/other/admin", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const data = response.data;

      if (data.status === "ok") {
        setMessage(data.message);
      }
    } catch (err) {
      console.log(err);

      // sending user to login page if refresh token expires
      navigate("/login", { state: { from: location }, replace: true });
    }
  };
  return (
    <div>
      <div>Admin</div>

      <div>{message}</div>

      <button onClick={getData}>Get admin data</button>
      <div>
        <button onClick={refresh}>Refresh</button>
      </div>
    </div>
  );
}
