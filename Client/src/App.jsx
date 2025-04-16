import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LogIn from "./pages/LogIn";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import "./App.css";
import { useNavigate } from "react-router-dom";
import People from "./pages/People";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Routes protégées avec layout commun */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/people" element={<div><People/></div>} />
          <Route path="/companies" element={<div>🏢 Companies</div>} />
          <Route path="/lists" element={<div>🗂 Lists</div>} />
          <Route path="/enrichment" element={<div>⚙️ Enrichment</div>} />
          <Route path="/emails" element={<div>📧 Emails</div>} />
          <Route path="/calls" element={<div>📞 Calls</div>} />
          <Route path="/meetings" element={<div>📅 Meetings</div>} />
          <Route path="/conversations" element={<div>💬 Conversations</div>} />
          <Route path="/deals" element={<div>💰 Deals</div>} />
          <Route path="/tasks" element={<div>✅ Tasks</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

const LandingPageWrapper = () => {
  const navigate = useNavigate();
  const handleSignUpClick = () => navigate("/signup");
  return <LandingPage onSignUpClick={handleSignUpClick} />;
};

export default App;
