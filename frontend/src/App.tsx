import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleDetail from './pages/ArticleDetail';
import Editor from './pages/Editor';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/article/:slug" element={<ArticleDetail />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:slug" element={<Editor />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default App;
