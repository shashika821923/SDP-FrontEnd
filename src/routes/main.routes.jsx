import React from 'react';
// Update your import statements to use Routes and Route
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../loginPages/pages/login.page';
import HomePageComponent from '../homePage/home.page';
import CreateAccountPage from '../loginPages/create.account';
import AddComplaint from '../complains/complains.add';
import ComplaintTable from '../complains/complins.listing';
import DashBoardView from '../dashboard/dashboard.view';
import UsersList from '../users/users.lisitng';

function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<CreateAccountPage />} />
        <Route path="/home" element={<HomePageComponent />} />
        <Route path="/addComplain" element={<AddComplaint />} />
        <Route path="/complainListing" element={<ComplaintTable />} />
        <Route path="/dashboard" element={<DashBoardView />} />
        <Route path="/userList" element={<UsersList />} />
        <Route path="/addOfficers" element={<CreateAccountPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
