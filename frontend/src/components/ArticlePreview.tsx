import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { articlesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ArticlePreviewProps {
  article: Article;
  onFavoriteChange?: (article: Article) => void;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article, onFavoriteChange }) => {
  const { isAuthenticated } = useAuth();

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      const response = article.favorited
        ? await articlesApi.unfavoriteArticle(article.slug)
        : await articlesApi.favoriteArticle(article.slug);
      
      if (onFavoriteChange) {
        onFavoriteChange(response.data.article);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}`}>
          <img src={article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} alt="" />
        </Link>
        <div className="info">
          <Link to={`/profile/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">{formatDate(article.createdAt)}</span>
        </div>
        <button
          className={`btn btn-outline-success btn-sm ${article.favorited ? 'btn-primary' : ''}`}
          onClick={handleFavorite}
          disabled={!isAuthenticated}
        >
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>
      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <div className="tag-list">
          {article.tagList.map((tag, index) => (
            <span key={index} className="tag-default">
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
};

export default ArticlePreview;
