import { useEffect, useState } from "react";
import { socket } from "./socket";
// import Browser
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import AppLayout from "./components/AppLayout";
import Screen from "./components/Screen";
import PageNotFound from "./components/PageNotFound";
import { fetchRoomList } from "./components/apiFunctions";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  // const

  // useEffect(() => {
  //   function onConnect() {
  //     alert("socket connnetced");
  //     setIsConnected(true);
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }

  //   // function onFooEvent(value) {
  //   //   setFooEvents((previous) => [...previous, value]);
  //   // }

  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);
  //   // socket.on("foo", onFooEvent);

  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //     // socket.off("foo", onFooEvent);
  //   };
  // }, []);

  socket.connect();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"></Route>
        <Route path="/app" element={<AppLayout />}>
          <Route
            path="list/:userid"
            element={<Screen />}
            // loader={fetchRoomList}
          />
          {/* <Route path="/list" element={}/> */}
        </Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
