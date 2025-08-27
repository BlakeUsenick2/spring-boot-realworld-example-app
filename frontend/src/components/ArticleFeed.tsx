import React, { useState, useEffect } from 'react';
import { articlesApi } from '../services/api';
import { Article } from '../types';
import ArticlePreview from './ArticlePreview';
import { useAuth } from '../contexts/AuthContext';

interface ArticleFeedProps {
  tag?: string;
  author?: string;
  favorited?: string;
  feed?: 'global' | 'personal';
}

const ArticleFeed: React.FC<ArticleFeedProps> = ({ tag, author, favorited, feed = 'global' }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { isAuthenticated } = useAuth();

  const articlesPerPage = 10;

  useEffect(() => {
    fetchArticles();
  }, [tag, author, favorited, feed, currentPage]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * articlesPerPage;
      const params = {
        tag,
        author,
        favorited,
        limit: articlesPerPage,
        offset,
      };

      const response = feed === 'personal' && isAuthenticated
        ? await articlesApi.getFeedArticles(params)
        : await articlesApi.getArticles(params);

      setArticles(response.data.articles);
      setTotalPages(Math.ceil(response.data.articlesCount / articlesPerPage));
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteChange = (updatedArticle: Article) => {
    setArticles(articles.map(article => 
      article.slug === updatedArticle.slug ? updatedArticle : article
    ));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="loading">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <div>
      {articles.map(article => (
        <ArticlePreview
          key={article.slug}
          article={article}
          onFavoriteChange={handleFavoriteChange}
        />
      ))}
      
      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ArticleFeed;
