import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { SocketProvider } from "./context/socket";
import { ChatProvider } from "./context/chat";
import { PeerProvider } from "./context/peer";

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <PeerProvider>
          <SocketProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </SocketProvider>
        </PeerProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
