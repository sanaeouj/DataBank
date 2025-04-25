import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LogIn from "./pages/LogIn";
import Dashboard from "./pages/Dashboard";
 import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import "./App.css";
import { useNavigate } from "react-router-dom";
 import People from "./pages/People"; 
 import AddPeople from "./pages/AddPeople";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/people" element={<div><People/></div>} />

        {/* Routes protégées avec layout commun */}
        <Route element={<DashboardLayout />}>
          <Route path="/companies" element={<div> <AddPeople/>   </div>} />
          <Route path="/lists" element={<div>🗂 Lists</div>} />
       
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
