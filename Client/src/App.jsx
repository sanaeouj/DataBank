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
import Peoples from "./pages/Peoples";
import AddPeople from "./pages/AddPeople";
import UpdateUser from "./pages/UpdateUser";
import Companies from "./pages/Companies";
import Lists from "./pages/Lists";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/login" element={<LogIn />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/people" element={<Peoples />} />
          <Route path="/AddPeople" element={<AddPeople />} />
          {/* <Route path="/UpdateUser" element={<UpdateUser />} /> */}
          <Route path="/companies" element={<Companies />} />
          <Route path="/lists" element={<Lists />} />
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
