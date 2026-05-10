import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="navbar-logo">
          Salesforce Observability
        </NavLink>
      </div>
      <div className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Logs
        </NavLink>
        <NavLink 
          to="/active-traces" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Active Traces
        </NavLink>
        <NavLink 
          to="/setup-trace" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Setup Trace
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
