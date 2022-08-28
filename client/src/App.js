import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Borough from "./pages/Borough";
import Neighborhood from "./pages/Neighborhood";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import ListingDetail from "./pages/ListingDetail";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { AuthContext } from "./helpers/AuthContext";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    status: false,
  });
  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage authState={authState} setAuthState={setAuthState} />
            }
          />
          <Route path="/borough" element={<Borough />} />
          <Route path="/neighborhood" element={<Neighborhood />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/listingDetail/:id" element={<ListingDetail />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
