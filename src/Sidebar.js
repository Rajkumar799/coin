// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faListAlt, faCreditCard, faUser, faUserShield, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar({ isOpen, onToggle }) {
  return (
    <nav id="sidebar" className={`bg-light ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-header">
        <button className="btn btn-link" onClick={onToggle}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <ul className="list-unstyled components">
        <li>
          <Link to="/admin" className={`btn btn-outline-primary w-100 mb-2 d-flex align-items-center ${isOpen ? 'justify-content-center' : ''}`}>
            <FontAwesomeIcon icon={faListAlt} className={`mr-2 ${isOpen ? 'mr-0' : ''}`} />
            {!isOpen && <span className="ml-2">Admin</span>}
          </Link>
        </li>
        <li>
          <Link to="/detail" className={`btn btn-outline-primary w-100 mb-2 d-flex align-items-center ${isOpen ? 'justify-content-center' : ''}`}>
            <FontAwesomeIcon icon={faCreditCard} className={`mr-2 ${isOpen ? 'mr-0' : ''}`} />
            {!isOpen && <span className="ml-2">Detail</span>}
          </Link>
        </li>
        <li>
          <Link to="/adminuser" className={`btn btn-outline-primary w-100 mb-2 d-flex align-items-center ${isOpen ? 'justify-content-center' : ''}`}>
            <FontAwesomeIcon icon={faUser} className={`mr-2 ${isOpen ? 'mr-0' : ''}`} />
            {!isOpen && <span className="ml-2">AdminUser</span>}
          </Link>
        </li>
        <li>
          <Link to="/manageadmin" className={`btn btn-outline-primary w-100 mb-2 d-flex align-items-center ${isOpen ? 'justify-content-center' : ''}`}>
            <FontAwesomeIcon icon={faUserShield} className={`mr-2 ${isOpen ? 'mr-0' : ''}`} />
            {!isOpen && <span className="ml-2">AdminManage</span>}
          </Link>
        </li>
      </ul>
      {/* Logout Button */}
      <div className="mt-auto">
        <ul className="list-unstyled components">
          <li>
            <Link to="/logout" className={`btn btn-outline-danger w-100 d-flex align-items-center ${isOpen ? 'justify-content-center' : ''}`}>
              <FontAwesomeIcon icon={faSignOutAlt} className={`mr-2 ${isOpen ? 'mr-0' : ''}`} />
              {!isOpen && <span className="ml-2">Logout</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
