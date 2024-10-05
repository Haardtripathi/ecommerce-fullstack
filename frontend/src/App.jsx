/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import AddProductPage from './pages/AddProductPage';
import ShopPage from './pages/ShopPage';
// import About from './pages/About';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route index element={<HomePage />} />
          <Route path="/admin/add-product" element={<AddProductPage />} />
          <Route path="/shop" element={<ShopPage />} />
          {/* <Route path="about" element={<About />} />  */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
