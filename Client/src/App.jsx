import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LogIn from "./pages/LogIn";
import Dashbord from "./pages/Dashbord";
import RequireAuth from "./components/RequireAuth";
import SignUp from "./pages/SignUp";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>              <Dashbord />
            </RequireAuth>
          }
        />
        <Route path="/Home" element={<div>🏠 Home</div>} />
        <Route path="/people" element={<div>🧑‍🤝‍🧑 People</div>} />
        <Route path="/companies" element={<div>🏢 Companies</div>} />
        <Route path="/lists" element={<div>🗂 Lists</div>} />
        <Route path="/enrichment" element={<div>⚙️ Enrichment</div>} />
        <Route path="/emails" element={<div>📧 Emails</div>} />
        <Route path="/calls" element={<div>📞 Calls</div>} />
        <Route path="/meetings" element={<div>📅 Meetings</div>} />
        <Route path="/conversations" element={<div>💬 Conversations</div>} />
        <Route path="/deals" element={<div>💰 Deals</div>} />
        <Route path="/tasks" element={<div>✅ Tasks</div>} />
      </Routes>
    </Router>
  );
}

const LandingPageWrapper = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/SignUp");
  };

  return <LandingPage onSignUpClick={handleSignUpClick} />;
};

export default App;
