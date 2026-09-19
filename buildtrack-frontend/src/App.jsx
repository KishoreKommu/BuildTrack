import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Workers from "./pages/Workers";
import Sites from "./pages/Sites";
import Attendance from "./pages/Attendance";
import Assignments from "./pages/Assignments";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/workers" element={<Workers />} />

        <Route path="/sites" element={<Sites />} />

        <Route path="/assignments" element={<Assignments />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
