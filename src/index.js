import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { SocketProvider } from "./context/socket";
import { ChatProvider } from "./context/chat";

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <SocketProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </SocketProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
