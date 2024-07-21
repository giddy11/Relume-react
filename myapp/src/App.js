import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Test from './Test';
import './App.css';
import { Navbar } from './components/navigationBar/Navbar';
import { Footer } from './components/footer/Footer';
import Homepage from './pages/Homepage/Homepage';
import Username from './components/auth/Username';
import Register from './components/auth/Register';
import Password from './components/auth/Password';
import Recovery from './components/auth/Recovery';
import Reset from './components/auth/Reset';
import Profile from './pages/Profile';

const Layout = ({ children }) => {
  const location = useLocation();

  // Define the routes where the Navbar and Footer should not be displayed
  const noNavFooterRoutes = ['/register', '/reset', '/recovery', '/profile'];

  const shouldHideNavFooter = noNavFooterRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavFooter && <Navbar />}
      <main>{children}</main>
      {!shouldHideNavFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/username" element={<Username />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password" element={<Password />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add other routes here */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
