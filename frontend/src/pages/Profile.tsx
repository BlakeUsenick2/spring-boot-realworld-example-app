import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { profilesApi } from '../services/api';
import { Profile as ProfileType } from '../types';
import ArticleFeed from '../components/ArticleFeed';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [activeTab, setActiveTab] = useState<'articles' | 'favorites'>('articles');
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await profilesApi.getProfile(username!);
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated || !profile) return;

    try {
      const response = profile.following
        ? await profilesApi.unfollowUser(profile.username)
        : await profilesApi.followUser(profile.username);
      
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="loading">Profile not found</div>;
  }

  const isOwnProfile = user?.username === profile.username;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={profile.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
                className="user-img"
                alt=""
                style={{ width: '104px', height: '104px', borderRadius: '50%' }}
              />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {isAuthenticated && !isOwnProfile && (
                <button
                  className={`btn btn-sm action-btn ${profile.following ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={handleFollow}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp;
                  {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('articles')}
                    style={{ background: 'none', border: 'none' }}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                    style={{ background: 'none', border: 'none' }}
                  >
                    Favorited Articles
                  </button>
                </li>
              </ul>
            </div>

            <ArticleFeed
              author={activeTab === 'articles' ? profile.username : undefined}
              favorited={activeTab === 'favorites' ? profile.username : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
