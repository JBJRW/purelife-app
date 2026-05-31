import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DrSmoothieAI from "./components/DrSmoothieAI";

export default function App() {
  useEffect(() => {
    // Prevent flash of unstyled content
    document.body.style.background = "#040A06";
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DrSmoothieAI />} />
        <Route path="/chat" element={<DrSmoothieAI />} />
        <Route path="/join" element={<DrSmoothieAI />} />
        <Route path="/smoothies" element={<DrSmoothieAI />} />
        <Route path="*" element={<DrSmoothieAI />} />
      </Routes>
    </BrowserRouter>
  );
}
