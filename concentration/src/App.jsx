import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/MainPage";
import Fire from "./pages/Concentration";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fire" element={<Fire />} />
      </Routes>
    </BrowserRouter>
  );
}