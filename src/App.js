import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Datacontext from "./Datacontext";
import Protectedroute from "./components/Protectedroute";

function App() {
  return (
    <Datacontext>
      <BrowserRouter>
        <div className="h-full w-full">
          <Routes>
            <Route path="/" element={<Protectedroute Element={Home} />} />
            <Route
              path="/register"
              element={<Protectedroute Element={Register} />}
            />
            <Route path="/login" element={<Protectedroute Element={Login} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Datacontext>
  );
}

export default App;
