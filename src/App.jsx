import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DrSmoothieAI from "./components/DrSmoothieAI";
import CommunityHub from "./components/community/CommunityHub";
import CreatorSpace from "./components/community/CreatorSpace";
export default function App() {
  useEffect(() => { document.body.style.background = "#040A06"; }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DrSmoothieAI />} />
        <Route path="/community" element={<CommunityHub />} />
        <Route path="/creators" element={<CreatorSpace />} />
        <Route path="*" element={<DrSmoothieAI />} />
      </Routes>
    </BrowserRouter>
  );
}