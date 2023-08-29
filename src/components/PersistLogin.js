// import { Outlet } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import { useEffect, useState } from "react";
// import useRefreshToken from "../hooks/useRefreshToken";
// import React from "react";

// const PersistLogin = () => {
//   const { auth } = useAuth();

//   const refresh = useRefreshToken();

//   const [isLoading, setLoading] = useState(false);

//   const verifyRefreshToken = async () => {
//     setLoading(true);
//     try {
//       console.log("tryinf");
//       const token = await refresh();
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (!auth?.user) {
//       verifyRefreshToken();
//     }
//   }, []);

//   console.log(isLoading);
//   //   useEffect(() => {
//   //     console.log(`isLoading : ${isLoading}`);
//   //     console.log("auth", auth);
//   //   }, [isLoading]);

//   return <>{isLoading ? <p>Loading....</p> : <Outlet />}</>;
// };

// export default PersistLogin;
import React, { useCallback } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";

function PersistLogin() {
  const { auth, persist } = useAuth();
  const refresh = useRefreshToken();
  const [isLoading, setLoading] = useState(true);

  const verifyRefreshToken = useCallback(async () => {
    try {
      await refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [refresh]);
  useEffect(() => {
    if (!auth?.user && persist) {
      verifyRefreshToken();
    } else {
      setLoading(false);
    }
  }, [auth, persist, verifyRefreshToken]);

  return <div>{isLoading ? <Loader /> : <Outlet />}</div>;
}

export default PersistLogin;

const Loader = () => {
  return <p>Loading....</p>;
};
