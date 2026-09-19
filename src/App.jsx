import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpillProvider } from "./context/SpillContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import DriftingIcon from "./components/DriftingIcon.jsx";
import Home from "./pages/Home.jsx";

export default function App(){

  return (
    <SpillProvider>
      <Sidebar />
      <DriftingIcon />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Analytics />
    </SpillProvider>
  );

}
