import React from "react";
import { BrowserRouter, Route, Switch, Routes } from "react-router-dom";
import CreateRoom from "./routes/createRoom";
import Room from "./routes/room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<CreateRoom />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
