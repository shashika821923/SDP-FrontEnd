import React from 'react';
// Update your import statements to use Routes and Route
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../loginPages/pages/login.page';
import HomePageComponent from '../homePage/home.page';

function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageComponent />} />
        <Route path="login/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
