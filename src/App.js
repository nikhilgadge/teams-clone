import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Coach from "./pages/Coach";
import Agent from "./pages/Agent";
import PersistLogin from "./components/PersistLogin";
import Call from "./pages/Call";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* <Route path="unauthorized" element={<Unauthorized />} /> */}

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="admin" element={<Admin />} />
            <Route path="coach" element={<Coach />} />
            <Route path="agent" element={<Agent />} />
            <Route path="call/:roomID" element={<Call />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
