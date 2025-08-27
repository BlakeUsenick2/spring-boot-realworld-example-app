import React, { useState } from 'react';
import ArticleFeed from '../components/ArticleFeed';
import PopularTags from '../components/PopularTags';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'personal' | 'tag'>('global');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const { isAuthenticated } = useAuth();

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('tag');
  };

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills">
                {isAuthenticated && (
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                      style={{ background: 'none', border: 'none' }}
                    >
                      Your Feed
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'global' ? 'active' : ''}`}
                    onClick={() => setActiveTab('global')}
                    style={{ background: 'none', border: 'none' }}
                  >
                    Global Feed
                  </button>
                </li>
                {activeTab === 'tag' && (
                  <li className="nav-item">
                    <span className="nav-link active">
                      <i className="ion-pound"></i> {selectedTag}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <ArticleFeed
              feed={activeTab === 'personal' ? 'personal' : 'global'}
              tag={activeTab === 'tag' ? selectedTag : undefined}
            />
          </div>

          <div className="col-md-3">
            <PopularTags onTagClick={handleTagClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
