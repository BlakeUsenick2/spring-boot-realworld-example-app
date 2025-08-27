import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          conduit
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/editor" className={`nav-link ${isActive('/editor') ? 'active' : ''}`}>
                  <i className="ion-compose"></i>&nbsp;New Article
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to={`/profile/${user?.username}`} 
                  className={`nav-link ${location.pathname.startsWith('/profile/') ? 'active' : ''}`}
                >
                  <img src={user?.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%', marginRight: '0.25rem' }} />
                  {user?.username}
                </Link>
              </li>
              <li className="nav-item">
                <button 
                  onClick={logout} 
                  className="nav-link" 
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
