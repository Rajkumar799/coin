import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import HomePage from './HomePage';
import BuyPage from './BuyPage';
import AdminPage from './AdminPage';
import AdminTransactionMethodPage from './AdminTransactionMethodPage';
import AdminUserPage from './AdminUserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/detail" element={<AdminTransactionMethodPage />} />
        <Route path="/adminuser" element={<AdminUserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
