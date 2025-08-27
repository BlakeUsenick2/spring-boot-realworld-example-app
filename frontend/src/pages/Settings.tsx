import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, updateUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setImage(user.image || '');
      setUsername(user.username);
      setBio(user.bio || '');
      setEmail(user.email);
    }
  }, [user, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const updateData: any = {
        image,
        username,
        bio,
        email,
      };

      if (password) {
        updateData.password = password;
      }

      await updateUser(updateData);
      navigate(`/profile/${username}`);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat() as string[];
        setErrors(errorMessages);
      } else {
        setErrors(['An error occurred while updating your settings']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-center">Your Settings</h1>

            {errors.length > 0 && (
              <div className="error-messages">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Settings'}
                </button>
              </fieldset>
            </form>

            <hr />

            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
