import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WorkerDashboard from "./pages/WorkerDashboard";
import LenderPortal from "./pages/LenderPortal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/lender" element={<LenderPortal />} />
      </Routes>
    </BrowserRouter>
  );
}
