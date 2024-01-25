import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Data from "./components/Data/Data";
import Details from "./components/Data/Details/Details";
import Overview from "./components/Data/Overview/Overview";
import Teams from "./components/Teams/Team";
import Account from "./components/Home/Account/Account";
import Dashboard from "./components/Home/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import Loader from "./components/Loader/Loader";
import Login from "./components/Login/Login";
import MainLayout from "./pages/MainLayout";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { resetToast } from "./store/features/toast/toastSlice";
import { Project } from "./components/Projects/Project";
import { Module } from "./components/Projects/Module";
import { InnerMod } from "./components/Projects/InnerMod";
import Workspace from "./components/Projects/Workspace";
import Modulecard from "./components/Projects/Modulecard";
import ModifiedCard from "./components/Projects/modifiedcard";
import TaskCard from "./components/Projects/taskcard";
import Page from "./components/Projects/createproject";
import CreateModule from "./components/Projects/createmodule";
import SignupDev from "./components/Login/SignUpDev";
import SignUpComp from "./components/Login/SignUpComp";
import CreateTeam from "./components/Projects/createTeam";
import CreateTask from "./components/Projects/Createtask";
import WorkSpacetask from "./components/Projects/Taskworkspace";

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check sessionStorage for user token on component mount
    const storedToken = sessionStorage.getItem('token') || localStorage.getItem('token');

    if (storedToken) {
      // If token found, fetch user data using the token
      fetchUserData(storedToken);
    }

    // Listen for changes in localStorage (across tabs)
    const tokenChangeListener = (event) => {
      if (event.key === 'token') {
        const newToken = event.newValue;
        if (newToken) {
          // If token found, fetch user data using the token
          fetchUserData(newToken);
        } else {
          // Handle logout if token is removed
          handleLogout();
        }
      }
    };

    window.addEventListener('storage', tokenChangeListener);

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener('storage', tokenChangeListener);
    };
  }, []); // Only run this effect on mount and unmount

  const fetchUserData = async (token) => {
    try {
      // Fetch user data using the obtained token
      const dataResponse = await fetch('http://localhost:5030/get-permissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!dataResponse.ok) {
        throw new Error(`Failed to fetch data: ${dataResponse.statusText}`);
      }
  
      const userData = await dataResponse.json();
      setUser(userData);
      setData(userData);
      sessionStorage.setItem('permissions', userData.permissions);
      sessionStorage.setItem('orgId', userData.orgId); 
      sessionStorage.setItem('userId', userData.userId); 
      localStorage.setItem('permissions', userData.permissions);
      localStorage.setItem('orgId', userData.orgId); 
      localStorage.setItem('userId', userData.userId); 
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleLogin = async (formData) => {
    try {
      const response = await fetch('http://localhost:5030/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);

        // Store the user token in sessionStorage and localStorage
        sessionStorage.setItem('token', userData.token);
        localStorage.setItem('token', userData.token);

        // Fetch data using the obtained token
        fetchUserData(userData.token);

        console.log('Login successful');
        navigate("/project"); // Navigate to the root route
      } else {
        console.error('Login failed');
        // Handle failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = () => {
    // Clear user data and token from state and sessionStorage on logout
    setUser(null);
    setData(null);
    sessionStorage.clear();
    localStorage.clear();
  };

  const toastState = useSelector((state) => state.toast);
  const toastRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (toastState.showToast)
      toastRef.current.show({
        severity: toastState.toastType,
        summary: String(toastState.toastType).toUpperCase(),
        detail: toastState.toastMessage,
      });
  }, [toastState]);
  return (
    <>
      <Loader />
      <Toast ref={toastRef} onShow={() => dispatch(resetToast())} life={500} />
      <Routes>
        {user ? (
          <>
            <Route path="Card" element={<ModifiedCard/>} />
            <Route path="page" element={<Page />} />
            <Route path="modulepage" element={<CreateModule/>} />
            <Route path="taskpage" element={<CreateTask />} />
            <Route path="teampage" element={<CreateTeam />} />
            <Route path="Taskcard" element={<TaskCard />} />
            <Route path="*" element={<MainLayout onLogout={handleLogout}  />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<Home />}>
                <Route index element={<Navigate to="account" replace />} />
                <Route path="account" element={<Account />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
              <Route path="workspace" element={<Workspace />} />
              <Route path="Teams" element={<Teams />} />
              <Route path="data" element={<Data />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<Overview />} />
                <Route path="details" element={<Details />} />
              </Route>
              <Route path="task/:project/:module" element={<InnerMod />} />
              <Route path="workspacetask/:project/:module" element={<WorkSpacetask/>}/>
              <Route path="project" element={<Project />} />
              <Route path="module/:project" element={<Module />} />
              <Route path="modulecard" element={<Modulecard />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route
              path="signupdev" 
              element={<SignupDev  />}
            />
             <Route
              path="signup" 
              element={<SignUpComp  />}
            />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
