import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

/* ── Pages ── */
import Landing       from './pages/Landing.jsx'
import HealthProfile from './pages/HealthProfile.jsx'
import WeeklySeries  from './pages/WeeklySeries.jsx'
import VideoStudio   from './pages/VideoStudio.jsx'
import Locator       from './pages/Locator.jsx'
import NotFound      from './pages/NotFound.jsx'

/* ── Global styles ── */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@700;800;900&family=Satoshi:wght@300;400;500;700;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body { background: #02060a; color: #f0ede6; font-family: 'Satoshi', system-ui, sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #030806; }
  ::-webkit-scrollbar-thumb { background: rgba(45,255,140,0.3); border-radius: 2px; }
  ::selection { background: rgba(45,255,140,0.2); color: #f0ede6; }
`;

function StyleInjector() {
  useEffect(() => {
    if (!document.getElementById('purelife-global')) {
      const s = document.createElement('style');
      s.id = 'purelife-global';
      s.textContent = globalCSS;
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

/* ── Scroll to top on route change ── */
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <StyleInjector />
      <ScrollTop />
      <Routes>
        <Route path="/"               element={<Landing />} />
        <Route path="/app/profile"    element={<HealthProfile />} />
        <Route path="/app/series"     element={<WeeklySeries />} />
        <Route path="/app/studio"     element={<VideoStudio />} />
        <Route path="/app/locator"    element={<Locator />} />
        <Route path="*"               element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
