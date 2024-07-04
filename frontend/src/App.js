import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Companies from "./components/pages/company";
import Ngo from "./components/pages/Ngo";
import Projects from "./components/pages/project";
import Team from "./components/pages/team";
import Module from "./components/pages/module";
import Task from "./components/pages/task";
import Navbar from "./components/Navbar";
import Login from "./components/login/Login";
import Box from "@mui/material/Box";
import Profile from "./components/pages/profile";
import SignupDev from "./components/login/SignUpDev";
import { Workspacecard } from "./components/cards/workspacecard";
import Workspace from "./components/pages/workspace";
import Taskworkspace from "./components/pages/taskworkspace";
import Dashboard from "./components/pages/Dashboard";
import Footer from "./components/footer";
import './App.css'; // Import your CSS file
import NgoProjects from "./components/Sub-Pages/NgoProject";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const storedUserData = localStorage.getItem("userData") || localStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
        setLoading(false);
      } else {
        const storedToken = localStorage.getItem("token") || localStorage.getItem("token");
        if (storedToken) {
          await fetchUserData(storedToken);
        }
        setLoading(false); 
      }
    };

    fetchData();

    const tokenChangeListener = (event) => {
      if (event.key === "token") {
        const newToken = event.newValue;
        if (newToken) {
          fetchData();
        } else {
          handleLogout();
        }
      }
    };

    window.addEventListener("storage", tokenChangeListener);

    return () => {
      window.removeEventListener("storage", tokenChangeListener);
    };
  }, []);

  const fetchUserData = async (token) => {
    try {
      const dataResponse = await fetch("http://10.8.0.12:5000/get-permissions", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!dataResponse.ok) {
        throw new Error(`Failed to fetch data: ${dataResponse.statusText}`);
      }

      const userData = await dataResponse.json();
      setUser(userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("permissions", userData.permissions);
      localStorage.setItem("orgId", userData.orgId);
      localStorage.setItem("userId", userData.userId);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("permissions", userData.permissions);
      localStorage.setItem("orgId", userData.orgId);
      localStorage.setItem("userId", userData.userId);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const response = await fetch("http://10.8.0.12:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("token", userData.token);
        fetchUserData(userData.token);
        navigate("/");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box className="app-container">
      {user && <Navbar />}
      <Box className="content-container">
        <Routes>
          {user ? (
            <>
              <Route path="/companies" element={<Companies />} />
              <Route path="/teams" element={<Team />} />
              <Route path="/" element={<Ngo />} />
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/projects" element={<Projects />} />
              <Route path="/module/:projectId" element={<Module />} />
              <Route path="/tasks/:moduleId" element={<Task />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path ="signupdev" element={<SignupDev/>}/>
              <Route path ="Dashboard" element={<Dashboard/>}/>
              <Route path="/taskworkspace/:moduleId" element={<Taskworkspace />} />
              <Route path ="/ngoprojects/:ngoId/:Name" element={<NgoProjects/>}/>
            </>
          ) : (
            <>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Login onLogin={handleLogin} />} />
            </>
          )}
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
